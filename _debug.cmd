@echo off

REM File:		_debug.cmd - Starts the SASS Transpiler & Python Flask Server, for local development
REM PreReq:		NodeJS, and run: pip3 install -r requirements.txt
REM Exec:		cmd.exe /c _debug.cmd
REM Author:		Ben Mullan 2024 for ((redacted)) 

set port=5000

start /b npx sass --watch "./frontend/resources/scss/":"./frontend/resources/css/"
start /b flask --app server.py run -h localhost -p %port%
start chrome http://localhost:%port%/
