# `notebook-2-app`...
...is an idiot-proof web-based databricks-notebook to web-application conversion platform.

<br/><img src="https://github.com/BenMullan/notebook-2-app/blob/main/frontend/resources/images/n2a-screenshots/notebook-deployment-pipeline.png?raw=true" /><br/>

It provides a user-friendly pipeline to automate the transformation of non-linear, loosely-structured Python _notebook-style_ code,
into maintainable, modular, robust, and efficient _applicaiton-code_; bridging the first two stages above.

This includes...
- Replacing `figure.show()` in a Dash app, with code to start a Dash server (`app = Dash()` ... `app.run()`)
- Removing _secrets_ (e.g. API keys) and placing them in a seperate `.env` file
- Suggesting the insertion of proper documentation & commentry within the code
- Moving pip dependancies into a centralised `requirements.txt` file
- Homogonising identifiers' naming conventions
- Freedom to insert custom transformations!

### Screenshots

_After entering a username..._
<br/><img src="https://github.com/BenMullan/notebook-2-app/blob/main/frontend/resources/images/n2a-screenshots/n2a-full-page.png?raw=true" /><br/>

_...`notebook-2-app` contacts the Databricks' workspace's REST API..._
<br/><img src="https://github.com/BenMullan/notebook-2-app/blob/main/frontend/resources/images/n2a-screenshots/n2a-step-1-1.png?raw=true" /><br/>

_...allowing selection of a python notebook directly from the workspace._
<br/><img src="https://github.com/BenMullan/notebook-2-app/blob/main/frontend/resources/images/n2a-screenshots/n2a-step-1-2.png?raw=true" /><br/>

_Choose which cells contain code needed for the application..._
<br/><img src="https://github.com/BenMullan/notebook-2-app/blob/main/frontend/resources/images/n2a-screenshots/n2a-step-2-0.png?raw=true" /><br/>

_...and `notebook-2-app` automatically suggests changes to make robust application-code..._
<br/><img src="https://github.com/BenMullan/notebook-2-app/blob/main/frontend/resources/images/n2a-screenshots/n2a-step-3-0.png?raw=true" /><br/>

_...plus feedback on code quality._
<br/><img src="https://github.com/BenMullan/notebook-2-app/blob/main/frontend/resources/images/n2a-screenshots/n2a-step-3-2.png?raw=true" /><br/>

_Simply download the resultant app-code package..._
<br/><img src="https://github.com/BenMullan/notebook-2-app/blob/main/frontend/resources/images/n2a-screenshots/n2a-step-4-0.png?raw=true" /><br/>

_...to instantly run the standalone app locally..._
<br/><img src="https://github.com/BenMullan/notebook-2-app/blob/main/frontend/resources/images/n2a-screenshots/n2a-step-4-1.png?raw=true" /><br/><br/>

_...or deploy it from a dev-ops' repository to an Azure App-Service, using the generated `deploy.yml`._
<br/><img src="https://github.com/BenMullan/notebook-2-app/blob/main/frontend/resources/images/n2a-screenshots/notebook-deployment-process.png?raw=true" /><br/>

### To use this software...
- Download [a `zip` of this repository](https://github.com/BenMullan/notebook-2-app/archive/refs/heads/main.zip)
- Populate /backend/server_code/secrets.py with values for [your Databricks Workspace](https://learn.microsoft.com/en-us/azure/databricks/dev-tools/auth/pat#--azure-databricks-personal-access-tokens-for-workspace-users)
- Execute `python -m flask --app ./server.py run`
  <br/>(Can use `_debug.cmd` on Windows for local development/testing; runs SASS transpiler & starts server)