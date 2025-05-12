import { useState, useRef } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ExclamationTriangleIcon, GitHubLogoIcon, CheckCircledIcon } from "@radix-ui/react-icons";
import { ScannedRepositories } from "./scanned-repositories";

export function GitHubScanner({ onScanSuccess }) {
  const [repoUrl, setRepoUrl] = useState("");
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState("");
  const [githubToken, setGithubToken] = useState("");
  const [showTokenInput, setShowTokenInput] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const scannedReposRef = useRef();

  const validateGitHubUrl = (url) => {
    try {
      const parsed = new URL(url);
      return parsed.hostname === "github.com" && parsed.pathname.split('/').filter(Boolean).length >= 2;
    } catch {
      return false;
    }
  };

  const manageRepoUrlChange = (e) => {
    setRepoUrl(e.target.value);
    setError("");
  };

  const manageTokenChange = (e) => {
    setGithubToken(e.target.value);
  };

  const manageScan = async () => {
    if (!repoUrl) {
      setError("Please enter a GitHub repository URL");
      return;
    }

    if (!validateGitHubUrl(repoUrl)) {
      setError("Please enter a valid GitHub repository URL (e.g., https://github.com/username/repository)");
      return;
    }

    setScanning(true);
    setError("");

    try {
      const response = await fetch("http://localhost:8080/api/scan/github", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          repoUrl,
          token: githubToken || undefined
        })
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error("Failed to scan GitHub repository");
        setError(data.error || "Failed to scan GitHub repository");
        throw new Error(data.error || "Failed to scan GitHub repository");
      }

      // Save to repository scan history
      const scanRecord = {
        id: data.id || Date.now().toString(),
        repoUrl,
        date: new Date().toISOString(),
        result: data.result || "clean",
        status: "completed",
        matchesFound: data.matchesFound || {},
        error: data.error || null
      };
      
      // Add to local storage
      const existingRepos = JSON.parse(localStorage.getItem('scannedRepositories') || '[]');
      const newRepos = [scanRecord, ...existingRepos];
      localStorage.setItem('scannedRepositories', JSON.stringify(newRepos));
      
      // Update UI
      if (scannedReposRef.current) {
        scannedReposRef.current.refresh();
      }
      setRefresh(r => r + 1);

      toast.success("GitHub repository scan completed");
      
      if (onScanSuccess && typeof onScanSuccess === "function") {
        onScanSuccess(data);
      }
      
      // Clear form
      setRepoUrl("");
    } catch (error) {
      console.error("Error scanning GitHub repository:", error);
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitHubLogoIcon className="h-5 w-5" />
            GitHub Repository Scanner
          </CardTitle>
          <CardDescription>
            Scan GitHub repositories for suspicious build events and potential backdoors
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="repo-url" className="text-sm font-medium">
                GitHub Repository URL
              </label>
              <Input
                id="repo-url"
                placeholder="https://github.com/username/repository"
                value={repoUrl}
                onChange={manageRepoUrlChange}
                disabled={scanning}
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <ExclamationTriangleIcon className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="link"
                className="p-0 h-auto text-xs"
                onClick={() => setShowTokenInput(!showTokenInput)}
              >
                {showTokenInput ? "Hide token input" : "Use GitHub token (optional)"}
              </Button>
            </div>

            {showTokenInput && (
              <div className="space-y-2">
                <label htmlFor="github-token" className="text-sm font-medium">
                  GitHub Token (for private repositories)
                </label>
                <Input
                  id="github-token"
                  type="password"
                  placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                  value={githubToken}
                  onChange={manageTokenChange}
                  disabled={scanning}
                />
                <p className="text-xs text-muted-foreground">
                  The token is only used for this scan and is not stored
                </p>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={manageScan} 
            disabled={scanning}
            className="w-full"
          >
            {scanning ? "Scanning..." : "Scan Repository"}
          </Button>
        </CardFooter>
      </Card>
      
      <ScannedRepositories ref={scannedReposRef} />
    </div>
  );
}
