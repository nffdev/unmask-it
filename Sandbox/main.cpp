#include <windows.h>
#include <fstream> 
#include <string>    
#include <iostream>
#include "MinHook.h"

typedef HANDLE(WINAPI* pCreateFileA)(
    LPCSTR, DWORD, DWORD, LPSECURITY_ATTRIBUTES, DWORD, DWORD, HANDLE
    );

pCreateFileA originalCreateFileA = NULL;

HANDLE WINAPI HookedCreateFileA(
    LPCSTR lpFileName, DWORD dwDesiredAccess, DWORD dwShareMode,
    LPSECURITY_ATTRIBUTES lpSecurityAttributes, DWORD dwCreationDisposition,
    DWORD dwFlagsAndAttributes, HANDLE hTemplateFile)
{
    std::ofstream log("log.txt", std::ios::app);
    log << "[CreateFileA] " << lpFileName << std::endl;
    log.close();

    return originalCreateFileA(
        lpFileName, dwDesiredAccess, dwShareMode, lpSecurityAttributes,
        dwCreationDisposition, dwFlagsAndAttributes, hTemplateFile
    );
}

void InitHooks() {
    if (MH_Initialize() != MH_OK) return;

    MH_CreateHook(&CreateFileA, &HookedCreateFileA, reinterpret_cast<LPVOID*>(&originalCreateFileA));
    MH_EnableHook(&CreateFileA);
}

int main(int argc, char* argv[]) {
    if (argc < 2) {
        std::cout << "Usage: sandbox.exe <target_exe>" << std::endl;
        return 1;
    }

    InitHooks();

    STARTUPINFOA si = { sizeof(si) };
    PROCESS_INFORMATION pi;

    if (!CreateProcessA(
        NULL, argv[1], NULL, NULL, FALSE,
        CREATE_SUSPENDED, NULL, NULL, &si, &pi))
    {
        std::cerr << "Error while launching the exe." << std::endl;
        return 1;
    }

    ResumeThread(pi.hThread);
    WaitForSingleObject(pi.hProcess, INFINITE);

    CloseHandle(pi.hProcess);
    CloseHandle(pi.hThread);

    MH_DisableHook(&CreateFileA);
    MH_Uninitialize();

    return 0;
}
