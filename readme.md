# `notebook-2-app`...
...is a foolproof web-based **databricks-notebook** to **web-application** conversion platform.

<iframe width="830" height="467" src="https://www.youtube.com/embed/djbnArkbJso?si=osvUTpkuk5dLp9N7" title="notebook-2-app-explained YouTube Video" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen="true" />

<img src="https://github.com/BenMullan/notebook-2-app/blob/main/frontend/resources/images/n2a-screenshots/notebook-deployment-pipeline.png?raw=true" width="100%" />

Bridging the first two of these ↑ stages, notebook-2-app provides a _user-friendly_ pipeline to automate the transformation of non-linear,
loosely-structured Python **notebook-style code**, into maintainable, modular, robust, and efficient **applicaiton-code**.

This includes...
- Specific notebook-only code substitutions, e.g. replacing `figure.show()` in a Dash app, with code to start a Dash server (`app = Dash()` ... `app.run()`)
- Re-wiring the notebook to maintain data sources, if it reads data from a workspace file (e.g. `/Workspace/dir/data.csv`)
- Identifying & removing _secrets_ (e.g. API keys) and placing them in a seperate `.env` file
- Suggesting the insertion of proper documentation & commentry within the code
- Moving pip dependancies into a centralised `requirements.txt` file
- Homogenising identifiers' naming conventions e.g. to `snake_case`
- (Freedom to insert custom transformations!)



<br/><br/>
## Under the hood
<img src="https://github.com/BenMullan/notebook-2-app/blob/main/frontend/resources/images/n2a-screenshots/n2a-streamline-process.png?raw=true" width="100%" />
Python notebooks give data scientists the freedom to quickly & loosely build prototypes with a dataset. They aren't - however - conducive  to building modular, robust, input-validating applications. This tool helps data scientists get application-ready code, fast.
<br/><br/>



## Walk-through

After entering a username...
<br/><img src="https://github.com/BenMullan/notebook-2-app/blob/main/frontend/resources/images/n2a-screenshots/n2a-full-page.png?raw=true" width="80%" /><br/>

...`notebook-2-app` contacts the Databricks' workspace's REST API...
<br/><img src="https://github.com/BenMullan/notebook-2-app/blob/main/frontend/resources/images/n2a-screenshots/n2a-step-1-1.gif?raw=true" width="80%" /><br/>

...allowing selection of a python notebook directly from the workspace.
<br/><img src="https://github.com/BenMullan/notebook-2-app/blob/main/frontend/resources/images/n2a-screenshots/n2a-step-1-2.png?raw=true" width="80%" /><br/>

Tick cells containing code needed for the application...
<br/><img src="https://github.com/BenMullan/notebook-2-app/blob/main/frontend/resources/images/n2a-screenshots/n2a-step-2-0.png?raw=true" width="80%" /><br/>

...and `notebook-2-app` automatically suggests changes, to make **secure** & **robust** application-code...
<br/><img src="https://github.com/BenMullan/notebook-2-app/blob/main/frontend/resources/images/n2a-screenshots/n2a-step-3-0.png?raw=true" width="80%" /><br/>

...plus feedback on code quality.
<br/><img src="https://github.com/BenMullan/notebook-2-app/blob/main/frontend/resources/images/n2a-screenshots/n2a-step-3-2.png?raw=true" width="80%" /><br/>

Simply download the resultant app-code package...
<br/><img src="https://github.com/BenMullan/notebook-2-app/blob/main/frontend/resources/images/n2a-screenshots/n2a-step-4-0.png?raw=true" width="80%" /><br/>

...to instantly run the standalone app locally...
<br/><br/><img src="https://github.com/BenMullan/notebook-2-app/blob/main/frontend/resources/images/n2a-screenshots/n2a-step-4-1.png?raw=true" width="100%" />

...or deploy it from a dev-ops' repository to an Azure App-Service, using the generated `deploy.yml`.
<br/><br/><br/>


## Porting notebook- to app-code
`notebook-2-app` focuses on three phases of code-conversion...
- **Syntactically**; for _neatness_. Notebook-code is passed through [black](https://github.com/psf/black) as an initial clean-up.
- **Operationally**; for _platform-compatibility_. E.g. replacing `figure.show()` in a Dash app, with code to start a Dash server (`app = Dash()` ... `app.run()`)
- **Structurally**; for _modularity_. Code is seperated into different functions & modules, for maintainability.
<br/><br/><img src="https://github.com/BenMullan/notebook-2-app/blob/main/frontend/resources/images/n2a-screenshots/notebook-code-vs-app-code.png?raw=true" width="100%" />
<br/><br/><br/>



## To use this software...
- Download [a `zip` of this repository](https://github.com/BenMullan/notebook-2-app/archive/refs/heads/main.zip)
- Populate /backend/server_code/secrets.py with values for [your Databricks Workspace](https://learn.microsoft.com/en-us/azure/databricks/dev-tools/auth/pat#--azure-databricks-personal-access-tokens-for-workspace-users)
- Specify your COMPANY_EMAIL_ADDRESS_ENDING in /frontend/resources/js/task-ui-functions.js
- Execute `python -m flask --app ./server.py run`
  <br/>(Can use `_debug.cmd` on Windows for local development/testing; runs SASS transpiler & starts server)



<br/><br/>
_This is a prototype software product, entirely open to receiving feedback & improvement ideas!_