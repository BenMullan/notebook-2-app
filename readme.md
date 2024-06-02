# `notebook-2-app`...
...is a foolproof web-based **databricks-notebook** to **web-application** conversion platform.

<br/><img src="https://github.com/BenMullan/notebook-2-app/blob/main/frontend/resources/images/n2a-screenshots/notebook-deployment-pipeline.png?raw=true" /><br/>

Bridging the first two of these ↑ stages, notebook-2-app provides a _user-friendly_ pipeline to automate the transformation of non-linear,
loosely-structured Python **notebook-style code**, into maintainable, modular, robust, and efficient **applicaiton-code**.

This includes...
- Specific notebook-only code substitutions, e.g. replacing `figure.show()` in a Dash app, with code to start a Dash server (`app = Dash()` ... `app.run()`)
- Identifying & removing _secrets_ (e.g. API keys) and placing them in a seperate `.env` file
- Suggesting the insertion of proper documentation & commentry within the code
- Moving pip dependancies into a centralised `requirements.txt` file
- Homogenising identifiers' naming conventions e.g. to `snake_case`
- (Freedom to insert custom transformations!)



## Walk-through

After entering a username...
<br/><img src="https://github.com/BenMullan/notebook-2-app/blob/main/frontend/resources/images/n2a-screenshots/n2a-full-page.png?raw=true" /><br/>

...`notebook-2-app` contacts the Databricks' workspace's REST API...
<br/><img src="https://github.com/BenMullan/notebook-2-app/blob/main/frontend/resources/images/n2a-screenshots/n2a-step-1-1.png?raw=true" /><br/>

...allowing selection of a python notebook directly from the workspace.
<br/><img src="https://github.com/BenMullan/notebook-2-app/blob/main/frontend/resources/images/n2a-screenshots/n2a-step-1-2.png?raw=true" /><br/>

Tick cells containing code needed for the application...
<br/><img src="https://github.com/BenMullan/notebook-2-app/blob/main/frontend/resources/images/n2a-screenshots/n2a-step-2-0.png?raw=true" /><br/>

...and `notebook-2-app` automatically suggests changes, to make **secure** & **robust** application-code...
<br/><img src="https://github.com/BenMullan/notebook-2-app/blob/main/frontend/resources/images/n2a-screenshots/n2a-step-3-0.png?raw=true" /><br/>

...plus feedback on code quality.
<br/><img src="https://github.com/BenMullan/notebook-2-app/blob/main/frontend/resources/images/n2a-screenshots/n2a-step-3-2.png?raw=true" /><br/>

Simply download the resultant app-code package...
<br/><img src="https://github.com/BenMullan/notebook-2-app/blob/main/frontend/resources/images/n2a-screenshots/n2a-step-4-0.png?raw=true" /><br/>

...to instantly run the standalone app locally...
<br/><br/><img src="https://github.com/BenMullan/notebook-2-app/blob/main/frontend/resources/images/n2a-screenshots/n2a-step-4-1.png?raw=true" /><br/>

...or deploy it from a dev-ops' repository to an Azure App-Service, using the generated `deploy.yml`.



## Business context
`notebook-2-app` might integrate into a **data-science deployment** workflow, like this...
<br/><br/><img src="https://github.com/BenMullan/notebook-2-app/blob/main/frontend/resources/images/n2a-screenshots/notebook-deployment-process.png?raw=true" /><br/>



## To use this software...
- Download [a `zip` of this repository](https://github.com/BenMullan/notebook-2-app/archive/refs/heads/main.zip)
- Populate /backend/server_code/secrets.py with values for [your Databricks Workspace](https://learn.microsoft.com/en-us/azure/databricks/dev-tools/auth/pat#--azure-databricks-personal-access-tokens-for-workspace-users)
- Execute `python -m flask --app ./server.py run`
  <br/>(Can use `_debug.cmd` on Windows for local development/testing; runs SASS transpiler & starts server)