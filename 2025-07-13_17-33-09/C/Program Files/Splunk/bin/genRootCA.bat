@echo off

set KEYLEN=2048
set PROMPT=1

if NOT DEFINED SPLUNK_HOME goto Usage

:LoopArgs
if "%1" == "" goto Continue

if "%1" == "-d" set CERTDIR=%2
if "%1" == "-l" set KEYLEN=%2
if "%1" == "-p" set PROMPT=0
shift
goto LoopArgs
:Continue

:: -d is required argument
if NOT DEFINED CERTDIR goto Usage

cd "%CERTDIR%"

IF NOT EXIST ca.pem goto DoGen

echo There is ca.pem in this directory. If you choose to replace the CA then splunk
echo servers will require new certs signed by this CA before they can interact with it.
echo Do you wish to replace the CA ? [y/N]
set /p REPLACE=

if "%REPLACE%" == "y" goto RemoveCertsFirst
if "%REPLACE%" == "Y" goto RemoveCertsFirst

echo Opted not to replace CA. Aborting.
exit 1

:RemoveCertsFirst
echo Deleting certs cacert.pem and ca.pem
echo del /f /q cacert.pem
call del /f /q cacert.pem
echo del /f /q ca.pem
call del /f /q ca.pem

:DoGen

echo This script will create a root CA.
echo It will output two files: ca.pem cacert.pem.
echo Distribute the cacert.pem to all clients you wish to connect to you.
echo Keep ca.pem for safe keeping for signing other clients certs.
echo Remember your password for the ca.pem you will need to later to sign other client certs.
echo Your root CA will expire in 10 years.

if "%PROMPT%" == "1" goto WithPrompt

  echo "%SPLUNK_HOME%\bin\openssl.exe" req -newkey rsa:%KEYLEN% -sha256 -keyout cakey.pem -out careq.pem
  call "%SPLUNK_HOME%\bin\openssl.exe" req -newkey rsa:%KEYLEN% -sha256 -keyout cakey.pem -out careq.pem
  echo "%SPLUNK_HOME%\bin\openssl.exe" x509 -req -in careq.pem -sha256 -extensions v3_ca -signkey cakey.pem -out cacert.pem -days 3650
  call "%SPLUNK_HOME%\bin\openssl.exe" x509 -req -in careq.pem -sha256 -extensions v3_ca -signkey cakey.pem -out cacert.pem -days 3650
goto RootKeyGenDone

:WithPrompt
  echo "%SPLUNK_HOME%\bin\openssl.exe" req -newkey rsa:%KEYLEN% -passout pass:password -subj /countryName=US/stateOrProvinceName=CA/localityName=SanFrancisco/organizationName=SplunkInc/commonName=SplunkCA/organizationName=SplunkUser/ -sha256 -keyout cakey.pem -out careq.pem
  call "%SPLUNK_HOME%\bin\openssl.exe" req -newkey rsa:%KEYLEN% -passout pass:password -subj /countryName=US/stateOrProvinceName=CA/localityName=SanFrancisco/organizationName=SplunkInc/commonName=SplunkCA/organizationName=SplunkUser/ -sha256 -keyout cakey.pem -out careq.pem
  echo "%SPLUNK_HOME%\bin\openssl.exe" x509 -req -in careq.pem -passin pass:password -sha256 -extensions v3_ca -signkey cakey.pem -out cacert.pem -days 3650
  call "%SPLUNK_HOME%\bin\openssl.exe" x509 -req -in careq.pem -passin pass:password -sha256 -extensions v3_ca -signkey cakey.pem -out cacert.pem -days 3650

:RootKeyGenDone

echo Create root cert ca.pem from cacert.pem and cakey.pem
type cacert.pem cakey.pem > ca.pem

echo "%SPLUNK_HOME%\bin\openssl.exe" x509 -subject -issuer -dates -noout -in ca.pem
call "%SPLUNK_HOME%\bin\openssl.exe" x509 -subject -issuer -dates -noout -in ca.pem

goto EXIT_SUCCESS

:Usage
    echo.
    echo Usage: splunk.exe cmd cmd.exe /c genCertCA.bat -d CERT_DIR [-l KEY_LEN] [-p]
    echo.
    echo  "-d CERT_DIR Where to store the root CA (e.g. c:\progra~1\Splunk\etc\certs). REQUIRED."
    echo.
    echo  "-l <KEYLEN> Length of RSA key to generate (default is %KEYLEN%). OPTIONAL."
    echo.
    echo  "-p Prompt for custom subject fields. OPTIONAL."
    echo.
    echo Note: if the -d path has spaces, use DOS-style paths (e.g. c:\progra~1 for c:\Program Files).
    echo.

    exit 1
goto EXIT_SUCCESS

:EXIT_SUCCESS
    exit 0

