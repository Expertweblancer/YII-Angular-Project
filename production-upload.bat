cls
@echo off
echo ---- building angular

cd angular
del .\dist\*.* /F /Q
ng build --prod  --extract-css=false | more /E /C /S 
echo %cd%
cd ..

echo ---- reparing file list to send to ftp
echo ----  preparing angular

echo ---- building ftpcmd.dat
(
  echo option batch abort 
  echo option confirm off 
  echo open sftp://jacek_angular:ASDF1234asdf@178.62.242.64 -passive=on 
) > ftpcmd.dat

dir angular\dist /b /a-d  > files-angular.dat | more /E /C

for /f "tokens=*" %%a in (files-angular.dat) do (
	echo put %%a ./public_html/ >> ftpcmd.dat 
)

echo exit >> ftpcmd.dat

cd angular\dist
echo ---- sending to ftp
c:\bin\WinSCP.com /script=../../ftpcmd.dat /log="C:\bin\winscp.log"
cd ..\..