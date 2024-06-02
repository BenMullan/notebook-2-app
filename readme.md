# `notebook-2-app`...
...is an idiot-proof web-based databricks-notebook to web-application conversion platform.

<br/><img src="https://github.com/BenMullan/notebook-2-app/blob/main/frontend/resources/images/n2a-screenshots/notebook-deployment-pipeline?raw=true" /><br/>

This package provides a user-friendly pipeline to automate changing non-linear, loosely-structured Python _notebook-style_ code,
into maintainable, modular, robust, and efficient _applicaiton-code_; bridging the first two stages above.

These transformations include...
- Replacing `figure.show()` in a Dash app, with code to start a Dash server (`app = Dash()` ... `app.run()`)
- Removing _secrets_ (e.g. API keys) and placing them in a seperate `.env` file
- Suggesting the insertion of proper documentation & commentry within the code
- Moving pip dependancies into a centralised `requirements.txt` file
- Homogonising identifiers' naming conventions

### Screenshots

After entering a username...
<br/><img src="https://github.com/BenMullan/notebook-2-app/blob/main/frontend/resources/images/n2a-screenshots/n2a-full-page?raw=true" /><br/>

...`notebook-2-app` contacts the Databricks' workspace's REST API...
<br/><img src="https://github.com/BenMullan/notebook-2-app/blob/main/frontend/resources/images/n2a-screenshots/n2a-step-1-1?raw=true" /><br/>

...allowing selection of a python notebook directly from the workspace.
<br/><img src="https://github.com/BenMullan/notebook-2-app/blob/main/frontend/resources/images/n2a-screenshots/n2a-step-1-2?raw=true" /><br/>

Choose which cells contain code needed for the application...
<br/><img src="https://github.com/BenMullan/notebook-2-app/blob/main/frontend/resources/images/n2a-screenshots/n2a-step-2-0?raw=true" /><br/>

...and `notebook-2-app` automatically suggests changes to make robust application-code...
<br/><img src="https://github.com/BenMullan/notebook-2-app/blob/main/frontend/resources/images/n2a-screenshots/n2a-step-3-0?raw=true" /><br/>

...plus feedback on code quality.
<br/><img src="https://github.com/BenMullan/notebook-2-app/blob/main/frontend/resources/images/n2a-screenshots/n2a-step-3-2?raw=true" /><br/>

Simply download the resultant app-code package...
<br/><img src="https://github.com/BenMullan/notebook-2-app/blob/main/frontend/resources/images/n2a-screenshots/n2a-step-4-0?raw=true" /><br/>

...to instantly run the standalone app locally...
<br/><img src="https://github.com/BenMullan/notebook-2-app/blob/main/frontend/resources/images/n2a-screenshots/n2a-step-4-1?raw=true" /><br/>

...or deploy it from a dev-ops' repository to an Azure App-Service, using the generated `deploy.yml`.
<br/><img src="https://github.com/BenMullan/notebook-2-app/blob/main/frontend/resources/images/n2a-screenshots/n2a-step-1-1?raw=true" /><br/>

### To use this software...
- Download [a `zip` of this repository](https://github.com/BenMullan/notebook-2-app/archive/refs/heads/main.zip)
- Populate /backend/server_code/secrets.py with values for [your Databricks Workspace](https://learn.microsoft.com/en-us/azure/databricks/dev-tools/auth/pat#--azure-databricks-personal-access-tokens-for-workspace-users)
- Run `python -m flask --app ./server.py run`
  <br/>(Can use `_debug.cmd` on Windows for local development/testing; runs SASS transpiler & starts server)