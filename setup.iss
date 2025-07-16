#define MyAppName "Pulsenics Modbus Viewer"
#define MyAppVersion "1.0.0"
#define MyAppId "B4C353AE-41B1-4934-8E46-A217453778D9"
#define MyAppPublisher "Pulsenics Inc."
#define MyAppURL "https://www.pulsenics.com/"
#define MyAppExeName "Pulsenics Modbus Viewer.exe"
#define MyClientExeName "pulsenics-modbus-viewer-app.exe"
#define MyServerExeName "main.exe"
#define MyAppAssocName MyAppName + " File"
#define MyAppAssocExt ".myp"
#define MyAppAssocKey StringChange(MyAppAssocName, " ", "") + MyAppAssocExt

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
ChangesAssociations=yes
DisableProgramGroupPage=yes

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
; nssm binary
Source: "nssm\*"; DestDir: "{app}\nssm"; Flags: ignoreversion recursesubdirs createallsubdirs
; config code
Source: "server-js\config.example.json"; DestDir: "{app}\server-js"; Flags: ignoreversion
Source: "server-js\config.json"; DestDir: "{app}\server-js"; Flags: ignoreversion
; server code
Source: "server-js\dist\*"; DestDir: "{app}\server-js\dist"; Excludes: "__pycache__"; Flags: ignoreversion recursesubdirs createallsubdirs
; client code
Source: "client\out\pulsenics-modbus-viewer-app-win32-x64\*"; DestDir: "{app}\client"; Flags: ignoreversion recursesubdirs createallsubdirs
; public
Source: "public\*"; DestDir: "{app}\public"; Flags: ignoreversion recursesubdirs createallsubdirs
; main code
Source: "start.bat"; DestDir: "{app}"; Flags: ignoreversion
Source: "run_silently.vbs"; DestDir: "{app}"; Flags: ignoreversion
Source: "run.bat"; DestDir: "{app}"; Flags: ignoreversion
Source: ".\stop.bat"; DestDir: "{app}"; Flags: ignoreversion
Source: ".\uninstall.bat"; DestDir: "{app}"; Flags: ignoreversion

[Registry]
Root: HKA; Subkey: "Software\Classes\{#MyAppAssocExt}\OpenWithProgids"; ValueType: string; ValueName: "{#MyAppAssocKey}"; ValueData: ""; Flags: uninsdeletevalue
Root: HKA; Subkey: "Software\Classes\{#MyAppAssocKey}"; ValueType: string; ValueName: ""; ValueData: "{#MyAppAssocName}"; Flags: uninsdeletekey
Root: HKA; Subkey: "Software\Classes\{#MyAppAssocKey}\DefaultIcon"; ValueType: string; ValueName: ""; ValueData: "{app}\{#MyAppExeName},0"
Root: HKA; Subkey: "Software\Classes\{#MyAppAssocKey}\shell\open\command"; ValueType: string; ValueName: ""; ValueData: """{app}\{#MyAppExeName}"" ""%1"""
Root: HKA; Subkey: "Software\Classes\Applications\{#MyAppExeName}\SupportedTypes"; ValueType: string; ValueName: ".myp"; ValueData: ""

[Icons]
Name: "{autoprograms}\{#MyAppName}"; Filename: "{app}\run.bat"; WorkingDir: "{app}"; IconFilename: {app}\public\logo.ico
Name: "{autodesktop}\{#MyAppName}"; Filename: "{app}\run.bat"; WorkingDir: "{app}"; IconFilename: {app}\public\logo.ico; Tasks: desktopicon

[Run]
Filename: {app}\run.bat; WorkingDir: "{app}"; Description: "Launch {#MyAppName}"; Flags: nowait postinstall

[UninstallRun]
Filename: "{app}\stop.bat"; Flags: runhidden; RunOnceId: "StopAllProcesses"
Filename: "{app}\uninstall.bat"; Flags: runhidden; RunOnceId: "RemoveServices"

[Code]
var
  IsUpgrade: Boolean;
  ShouldRunExecuteUninstall: Boolean;
 
function RunPowerShellCommand(Command: string): Boolean;
var
  ResultCode: Integer;
begin
  // Run PowerShell with the specified command
  Result := Exec(
    ExpandConstant('{sys}\WindowsPowerShell\v1.0\powershell.exe'),
    '-NoProfile -ExecutionPolicy Bypass -Command "' + Command + '"',
    '',
    SW_HIDE,
    ewWaitUntilTerminated,
    ResultCode
  );
  
  // Check if the command was successful
  if not Result then
    MsgBox('Error executing PowerShell command: ' + Command, mbError, MB_OK);
end;

function IsAppAlreadyInstalled: Boolean;
begin
  Result := False;
  if RegKeyExists(HKEY_LOCAL_MACHINE,
       'SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\{{#MyAppId}}}_is1') or
     RegKeyExists(HKEY_CURRENT_USER,
       'SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\{{#MyAppId}}}_is1') then
  begin
    Result := True;
  end;
end;

procedure ExecuteUninstall;
var
  ResultCode: Integer;
  UninstallAppPath: String;
begin
  UninstallAppPath := ExpandConstant('{app}\uninstall.bat');
  if FileExists(UninstallAppPath) then
  begin
    ShellExec('', UninstallAppPath, '', '', SW_HIDE, ewWaitUntilTerminated, ResultCode);
  end
  else
  begin
    MsgBox('stop.bat file not found. Skipping process termination.', mbError, MB_OK);
  end;
end;

procedure CurStepChanged(CurStep: TSetupStep);
begin
  if (CurStep = ssInstall) and ShouldRunExecuteUninstall then
  begin
    // Now it's safe to use {app} as it has been initialized
    ExecuteUninstall;
  end;
end;

procedure InitializeWizard();
var
  ResultCode: Integer;
  UserChoice: Integer;
  UninstallerPath: String;
  InstallPath: String;
begin
  IsUpgrade := IsAppAlreadyInstalled;
  ShouldRunExecuteUninstall := False;

  if IsUpgrade then
  begin
    // Give the user an option to repair or uninstall
    UserChoice := MsgBox('The application is already installed. Would you like to repair or uninstall it?' + #13#10 +
                         'Yes = Repair, No = Uninstall, Cancel = Exit setup.', mbConfirmation, MB_YESNOCANCEL);

    case UserChoice of
      IDYES:
        begin
          // Proceed with the repair (continue with the installation)
          MsgBox('Repairing the installation...', mbInformation, MB_OK);
          ShouldRunExecuteUninstall := True; // Defer the call to ExecuteUninstall
        end;
      IDNO:
        begin
          RegQueryStringValue(HKEY_LOCAL_MACHINE, 'Software\Microsoft\Windows\CurrentVersion\Uninstall\{{#MyAppId}}}_is1', 'InstallLocation', InstallPath);
          
          // Manually construct the uninstaller path
          UninstallerPath := InstallPath + 'unins000.exe';
                    
          // Call the uninstaller and wait for it to complete
          ShellExec('', UninstallerPath, '', '', SW_SHOWNORMAL, ewWaitUntilTerminated, ResultCode);

          if ResultCode = 0 then
          begin
            Abort;  // Exit the installer after uninstallation
          end
          else
          begin
            // Handle the case where uninstallation failed
            MsgBox('Uninstallation failed. Please try again.', mbError, MB_OK);
            Abort;  // Exit installer on failure
          end;
        end;
      IDCANCEL:
        begin
          // Exit the installer on cancel
          MsgBox('Exiting setup.', mbInformation, MB_OK);
          Abort;  // Cancel installation and exit
        end;
    end;
  end;
end;