const axios = require('axios');
const { parse: parseUrl } = require('url');

// === Configuration ===
// The strings we want to search for in the project files
// These are common indicators of backdoors or malicious scripts
const TARGET_STRINGS = [
    "PreBuildEvent",
    "PostBuildEvent",
    "Exec",
    "Command=",
    "@echo off",
    "cscript",
    "//nologo",
    "cmd.exe",
    "-hidden",
    "ExecutionPolicy",
    "powershell.exe",
    "wscript.exe",
    ".vbs",
];

const API_BASE = "https://api.github.com";

/**
 * Parse a GitHub URL to extract owner and repository name
 * @param {string} url - GitHub repository URL
 * @returns {Object} Object containing owner and repo
 */
function parseGithubUrl(url) {
    const parsed = parseUrl(url);
    const pathMatch = parsed.pathname.match(/^\/([^\/]+)\/([^\/]+?)(?:\.git)?\/?\/?$/);
        
    if (!pathMatch) {
        throw new Error("Invalid GitHub repository URL.");
    }
    
    const [, owner, repo] = pathMatch;
    return { 
        owner: encodeURIComponent(owner), 
        repo: encodeURIComponent(repo) 
    };
}

/**
 * Get the default branch of a repository
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @param {string} token - GitHub API token
 * @returns {Promise<string>} Default branch name
 */
async function getRepoDefaultBranch(owner, repo, token) {
    const headers = token ? {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json'
    } : {
        'Accept': 'application/vnd.github.v3+json'
    };

    const url = `${API_BASE}/repos/${owner}/${repo}`;
    const response = await axios.get(url, { headers });
    return response.data.default_branch;
}

/**
 * Get the repository file tree
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @param {string} branch - Branch name
 * @param {string} token - GitHub API token
 * @returns {Promise<Array>} Repository tree
 */
async function getRepoTree(owner, repo, branch, token) {
    const headers = token ? {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json'
    } : {
        'Accept': 'application/vnd.github.v3+json'
    };

    const url = `${API_BASE}/repos/${owner}/${repo}/git/trees/${encodeURIComponent(branch)}?recursive=1`;
    const response = await axios.get(url, { headers });
    return response.data.tree;
}

/**
 * Get the content of a file
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @param {string} path - File path
 * @param {string} token - GitHub API token
 * @returns {Promise<string>} File content
 */
async function getFileContent(owner, repo, filePath, token) {
    const headers = token ? {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json'
    } : {
        'Accept': 'application/vnd.github.v3+json'
    };

    const url = `${API_BASE}/repos/${owner}/${repo}/contents/${encodeURIComponent(filePath)}`;
    const response = await axios.get(url, { headers });
    
    const content = response.data.content || "";
    const encoding = response.data.encoding || "base64";
    
    if (encoding === "base64") {
        return Buffer.from(content, 'base64').toString('utf-8');
    }
    return "";
}

/**
 * Scan a GitHub repository for suspicious strings
 * @param {string} repoUrl - GitHub repository URL
 * @param {string} token - GitHub API token (optional)
 * @returns {Promise<Object>} Scan results
 */
async function scanRepository(repoUrl, token = "") {
    const results = {
        repoUrl,
        matchesFound: {},
        error: null,
        scanCompleted: false
    };

    try {
        const { owner, repo } = parseGithubUrl(repoUrl);
        const branch = await getRepoDefaultBranch(owner, repo, token);
        
        console.log(`\nScanning ${owner}/${repo}@${branch}...`);
        
        const tree = await getRepoTree(owner, repo, branch, token);
        
        // Filter for project files
        const projectFiles = tree.filter(item => 
            item.type === "blob" && 
            (item.path.endsWith(".csproj") || 
             item.path.endsWith(".vbproj") || 
             item.path.endsWith(".vcxproj"))
        );
        
        // Check each file for suspicious strings
        for (const file of projectFiles) {
            try {
                const content = await getFileContent(owner, repo, file.path, token);
                const found = TARGET_STRINGS.filter(str => content.includes(str));
                
                if (found.length >= 2) {
                    results.matchesFound[file.path] = found;
                    console.log(`[!] Suspicious strings found in: ${file.path}`);
                    console.log(`  Matched strings: ${found.join(', ')}`);
                }
            } catch (error) {
                console.error(`Error reading ${file.path}: ${error.message}`);
            }
        }
        
        if (Object.keys(results.matchesFound).length === 0) {
            console.log("Found no suspicious strings in the project files.");
        }
        
        console.log("\nScan completed.");
        results.scanCompleted = true;
    } catch (error) {
        results.error = error.message;
        console.error(`Error setting up repo scan: ${error.message}`);
    }
    
    return results;
}

module.exports = { scanRepository, TARGET_STRINGS };
