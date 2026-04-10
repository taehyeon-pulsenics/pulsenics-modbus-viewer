#define MyAppName "Pulsenics Modbus Viewer"
#define MyAppVersion "1.0.0"
#define MyAppId "B4C353AE-41B1-4934-8E46-A217453778D9"
#define MyAppPublisher "Pulsenics Inc."
#define MyAppURL "https://www.pulsenics.com/"

[Setup]
AppId={{{#MyAppId}}}
AppName={#MyAppName}
AppVersion={#MyAppVersion}
AppPublisher={#MyAppPublisher}
AppPublisherURL={#MyAppURL}
AppSupportURL={#MyAppURL}
AppUpdatesURL={#MyAppURL}
DefaultDirName={autopf}\{#MyAppName}

ArchitecturesAllowed=x64compatible
ArchitecturesInstallIn64BitMode=x64compatible

DisableProgramGroupPage=yes
PrivilegesRequired=admin
OutputBaseFilename=Pulsenics Modbus Viewer Installer
Compression=lzma
SolidCompression=yes
WizardStyle=modern
SetupIconFile=.\public\logo.ico
Uninstallable=yes

[Languages]
Name: "english"; MessagesFile: "compiler:Default.isl"

[Tasks]
Name: "desktopicon"; Description: "{cm:CreateDesktopIcon}"; GroupDescription: "{cm:AdditionalIcons}"; Flags: unchecked

[Files]
; config
Source: "server\config.example.json"; DestDir: "{app}\server"; Flags: ignoreversion
Source: "server\config.json"; DestDir: "{app}\server"; Flags: ignoreversion onlyifdoesntexist
; server executable
Source: "server\dist\*"; DestDir: "{app}\server\dist"; Flags: ignoreversion recursesubdirs createallsubdirs
; client
Source: "client\out\pulsenics-modbus-viewer-app-win32-x64\*"; DestDir: "{app}\client"; Flags: ignoreversion recursesubdirs createallsubdirs
; public assets
Source: "public\*"; DestDir: "{app}\public"; Flags: ignoreversion recursesubdirs createallsubdirs
; scripts
Source: "start.bat"; DestDir: "{app}"; Flags: ignoreversion
Source: "startClient.bat"; DestDir: "{app}"; Flags: ignoreversion
Source: "startServer.bat"; DestDir: "{app}"; Flags: ignoreversion
Source: "runSilently.vbs"; DestDir: "{app}"; Flags: ignoreversion
Source: "run.bat"; DestDir: "{app}"; Flags: ignoreversion
Source: "stop.bat"; DestDir: "{app}"; Flags: ignoreversion
Source: "stopClient.bat"; DestDir: "{app}"; Flags: ignoreversion
Source: "stopServer.bat"; DestDir: "{app}"; Flags: ignoreversion
Source: "uninstall.bat"; DestDir: "{app}"; Flags: ignoreversion

[InstallDelete]
; Clean old client and server binaries on upgrade so stale files don't linger
Type: filesandordirs; Name: "{app}\client"
Type: filesandordirs; Name: "{app}\server\dist"

[Icons]
Name: "{autoprograms}\{#MyAppName}"; Filename: "{app}\run.bat"; WorkingDir: "{app}"; IconFilename: "{app}\public\logo.ico"
Name: "{autodesktop}\{#MyAppName}"; Filename: "{app}\run.bat"; WorkingDir: "{app}"; IconFilename: "{app}\public\logo.ico"; Tasks: desktopicon

[Run]
Filename: "{app}\run.bat"; WorkingDir: "{app}"; Description: "Launch {#MyAppName}"; Flags: nowait postinstall

[UninstallRun]
Filename: "{sys}\taskkill.exe"; Parameters: "/F /IM pulsenics-modbus-viewer-server.exe /T"; Flags: runhidden waituntilterminated; RunOnceId: "StopServer"
Filename: "{sys}\taskkill.exe"; Parameters: "/F /IM pulsenics-modbus-viewer-app.exe /T"; Flags: runhidden waituntilterminated; RunOnceId: "StopClient"

[Code]
function IsAppAlreadyInstalled: Boolean;
begin
  Result :=
    RegKeyExists(HKEY_LOCAL_MACHINE,
      'SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\{{#MyAppId}}}_is1') or
    RegKeyExists(HKEY_CURRENT_USER,
      'SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\{{#MyAppId}}}_is1');
end;

procedure StopRunningApp;
var
  ResultCode: Integer;
begin
  Exec(ExpandConstant('{sys}\taskkill.exe'), '/F /IM pulsenics-modbus-viewer-server.exe /T', '', SW_HIDE, ewWaitUntilTerminated, ResultCode);
  Exec(ExpandConstant('{sys}\taskkill.exe'), '/F /IM pulsenics-modbus-viewer-app.exe /T', '', SW_HIDE, ewWaitUntilTerminated, ResultCode);
end;

procedure CurStepChanged(CurStep: TSetupStep);
begin
  if CurStep = ssInstall then
    StopRunningApp;
end;

procedure InitializeWizard();
var
  UserChoice: Integer;
  InstallPath: String;
  UninstallerPath: String;
  ResultCode: Integer;
begin
  if not IsAppAlreadyInstalled then
    Exit;

  UserChoice := MsgBox(
    'The application is already installed.' + #13#10 +
    'Yes = Repair/Upgrade, No = Uninstall, Cancel = Exit.',
    mbConfirmation, MB_YESNOCANCEL);

  case UserChoice of
    IDYES:
      MsgBox('Proceeding with upgrade...', mbInformation, MB_OK);
    IDNO:
      begin
        if RegQueryStringValue(HKEY_LOCAL_MACHINE,
             'SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\{{#MyAppId}}}_is1',
             'InstallLocation', InstallPath) or
           RegQueryStringValue(HKEY_CURRENT_USER,
             'SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\{{#MyAppId}}}_is1',
             'InstallLocation', InstallPath) then
        begin
          UninstallerPath := InstallPath + 'unins000.exe';
          ShellExec('', UninstallerPath, '', '', SW_SHOWNORMAL, ewWaitUntilTerminated, ResultCode);
        end;
        Abort;
      end;
    IDCANCEL:
      Abort;
  end;
end;
