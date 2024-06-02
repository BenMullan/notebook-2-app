# File:		server.py - API for `notebook-2-app` pipeline application
# PreReq:	run: pip3 install pipreqs flask black radon pylint
# Exec:		$ pushd notebook-2-app/ && flask --app server.py run
# Author:	Ben Mullan 2024 for ((redacted)) 

import sys, os, subprocess, shutil, json, re, datetime, random, string, urllib.request, flask;
from backend.server_code import server_utils, databricks_interaction, code_generation;


app = flask.Flask(
	__name__,
	static_url_path = "",
	static_folder = "./frontend/"
);


@app.route("/")
def index():
	return flask.send_file("./frontend/index.xhtml");


# Required URL params: databricks-path
# E.g. /api/get-databricks-dir-listing?databricks-path=/Workspace
@app.route("/api/get-databricks-dir-listing")
def api_get_databricks_dir_listing():
	
	_databricks_path = flask.request.args.get("databricks-path");
	
	if _databricks_path in [None, ""]:
		return flask.Response("No ?databricks-path was specified.", status=400, mimetype="text/plain");
	
	if not server_utils.is_clean_posix_path(_databricks_path):
		return flask.Response(f"This ?databricks-path is syntactically-invalid: {_databricks_path}", status=400, mimetype="text/plain");
	
	try: return databricks_interaction.get_databricks_dir_listing_json(_databricks_path);
	except Exception as _e: return flask.Response(f"Couldn't get databricks-dir-listing; {str(_e)}", status=500, mimetype="text/plain");


# Required URL params: notebook-path
# E.g. /api/get-notebook-cells?notebook-path=/Workspace/notebook
@app.route("/api/get-notebook-cells")
def api_get_notebook_cells():
	
	_notebook_path = flask.request.args.get("notebook-path");
	
	if _notebook_path in [None, ""]:
		return flask.Response("No ?notebook-path was specified.", status=400, mimetype="text/plain");
	
	if not server_utils.is_clean_posix_path(_notebook_path):
		return flask.Response(f"This ?notebook-path is syntactically-invalid: {_notebook_path}", status=400, mimetype="text/plain");
	
	try: return databricks_interaction.get_notebook_cells_json(_notebook_path);
	except Exception as _e: return flask.Response(f"Couldn't get notebook-cells; {str(_e)}", status=500, mimetype="text/plain");


# Required URL params: notebook-path, selected-cells
# E.g. /api/generate-app-code?notebook-path=/Workspace/notebook&selected-cells=0,3,4
@app.route("/api/generate-app-code")
def api_generate_app_code():
	
	_notebook_path = flask.request.args.get("notebook-path");
	_selected_cells = flask.request.args.get("selected-cells");
	
	if _notebook_path in [None, ""]:
		return flask.Response("No ?notebook-path was specified.", status=400, mimetype="text/plain");
	
	if not server_utils.is_clean_posix_path(_notebook_path):
		return flask.Response(f"This ?notebook-path is syntactically-invalid: {_notebook_path}", status=400, mimetype="text/plain");
	
	if _selected_cells in [None, ""]:
		return flask.Response("No ?selected-cells were specified.", status=400, mimetype="text/plain");
	
	if not server_utils.is_clean_comma_array(_selected_cells):
		return flask.Response(f"These ?selected-cells are syntactically-invalid: {_selected_cells}", status=400, mimetype="text/plain");
	
	# Here, we have a valid _notebook_path and _selected_cells.
	# Next, download the notebook's cells' JSON, and generate_mainpy_from_notebook_cells().
	
	_notebook_ipynb_json = "";
	try: _notebook_ipynb_json =  databricks_interaction.get_notebook_cells_json(_notebook_path);
	except Exception as _e: return flask.Response("Couldn't download notebook; " + str(_e), status=500, mimetype="text/plain");
	
	_appcode_file_path = ""
	try: _appcode_file_path = code_generation.generate_mainpy_from_notebook_cells(_notebook_path, _notebook_ipynb_json, [int(_i) for _i in _selected_cells.split(",")]);
	except Exception as _e: return flask.Response("Couldn't generate app-code; " + str(_e), status=500, mimetype="text/plain");
	
	# We now have a file path e.g. "./backend/initial-app-code/hr64hgfkur74h.py"
	# Next, attempt to run it through "psf/black" to homogonise formatting...
	#	If black fails (e.g. because the input python-code is syntactically-invalid)
	#	 then put a comment on the last line, reporting this error.
	#	 (doing this on the 1st line would shift all line-numbers in the errors would be wrong)
	
	try:
		code_generation.reformat_appcode_with_black(_appcode_file_path);
	except Exception as _e:
		try: open(_appcode_file_path, "a").write(f"\n\n#Couldn't re-format this file with black, because { str(_e).replace(chr(10), '') }");
		except: return flask.Response(f"Couldn't re-format app-code for {_appcode_file_path}; " + str(_e), status=500, mimetype="text/plain");
	
	try:
	
		return flask.Response(
			json.dumps(
				{
					"mainpy_code"		: open(_appcode_file_path).read(),
					"code_suggestions"	: code_generation.get_appcode_suggestions(_appcode_file_path),
					"code_stats"		: code_generation.get_appcode_stats_with_radon(_appcode_file_path)
				}
			),
			mimetype="application/json"
		);
			
	except Exception as _e:
		return flask.Response(f"Couldn't generate app-code or code-suggestions/-stats for {_appcode_file_path}; {str(_e)}", status=500, mimetype="text/plain");


# Required URL params: 
# Required POST data keys: edited-app-code
# E.g. /api/submit-edited-app-code
@app.route("/api/submit-edited-app-code", methods = ["POST"])
def api_submit_edited_app_code():
	"""
		→ Receive the edited-app-code as POST data (request body)
		← Respond with the name "key" of the packaged app-code zip-file (e.g. "h40ddjl293jdjf8")
		
		Create a new folder for the app-code-package, e.g. "./backend/packaged-app-code/h40ddjl293jdjf8/"
		In that directory:
			- Save the edited-app-code as main.py
			- Generate a CI deployment YAML file
			- Generate a readme.txt
			- Generate a requirements.txt (using pipreqs)
		Package that directory's contents into an eponymous zip file
	"""
	
	_edited_app_code = flask.request.form.get("edited-app-code");
	
	# `_appcode_package_folder` looks like e.g. "./backend/packaged-app-code/hd8743hsd93hdlkfl"
	_appcode_package_key = server_utils.get_new_packaged_app_code_foldername();
	_appcode_package_folder = os.path.join(server_utils.PACKAGED_APPCODE_FOLDER, _appcode_package_key);
	os.makedirs(_appcode_package_folder);
	
	# ----------------------
	# Write main.py
	# ----------------------
	
	try: open(os.path.join(_appcode_package_folder, "main.py"), "w", encoding="utf-8").write(_edited_app_code);
	except Exception as _e: return flask.Response(f"Couldn't write main.py app-code for {_appcode_package_folder}; " + str(_e), status=500, mimetype="text/plain");
	
	# ----------------------
	# Write deploy.yml
	# ----------------------
	
	try: open(os.path.join(_appcode_package_folder, "deploy.yml"), "w" ,encoding="utf-8").write(code_generation.generate_deployment_yaml_file_contents());
	except Exception as _e: return flask.Response(f"Couldn't write deploy.yml for {_appcode_package_folder}; " + str(_e), status=500, mimetype="text/plain");
	
	# ----------------------
	# Write readme.txt
	# ----------------------
	
	try: open(os.path.join(_appcode_package_folder, "readme.txt"), "w", encoding="utf-8").write(code_generation.generate_readme_txt_file_contents());
	except Exception as _e: return flask.Response(f"Couldn't write readme.txt for {_appcode_package_folder}; " + str(_e), status=500, mimetype="text/plain");
	
	# ----------------------
	# Write requirements.txt
	# ----------------------
	
	try:
		_subproc_output = server_utils.get_process_output(["pipreqs", _appcode_package_folder]);
		if not ("Successfully saved requirements file" in _subproc_output): raise Exception(f"Pipreqs dependancies-gathering may have run unsuccessfully. \n Output: {_subproc_output}");
	except Exception as _e:
		print(f"Pipreqs dependancies-gathering encountered an error; {str(_e)}", status=500, mimetype="text/plain");
		try: open(os.path.join(_appcode_package_folder, "requirements.txt"), "w", encoding="utf-8").write(f"Couldn't automatically generate requirements.txt, because... \n\n {str(e)}");
		except Exception as _e: return flask.Response(f"`pipreqs` requitements.txt-generation failed for {_appcode_package_folder}, and this couldn't even be logged in the requirements.txt file because {str(_e)}", status=500, mimetype="text/plain");
	
	# ----------------------
	# Create eponymous *.zip
	# ----------------------
	
	try: shutil.make_archive(_appcode_package_folder, "zip", _appcode_package_folder);
	except Exception as _e: return flask.Response(f"Couldn't package {_appcode_package_folder} into zip-file; " + str(_e), status=500, mimetype="text/plain");
	
	return flask.Response(
		json.dumps({ "appcode-package-key" : _appcode_package_key }),
		mimetype="application/json"
	);


# Required URL params: zip-key
# E.g. /api/download-app-code-package?zip-key=h40ddjl293jdjf8
@app.route("/api/download-app-code-package")
def api_download_app_code_package():
	"""
		→ Receive the zip-key (e.g."h40ddjl293jdjf8")
		← Respond with the target zip-file (e.g. "./backend/packaged-app-code/h40ddjl293jdjf8.zip")
		  with MIME-type "application/x-zip"
	"""
	
	_zip_key = flask.request.args.get("zip-key");
	
	if _zip_key in [None, ""]:
		return flask.Response("No ?zip-key was specified.", status=400, mimetype="text/plain");
	
	if not server_utils.is_clean_alphanumeric_string(_zip_key):
		return flask.Response(f"This ?zip-key is syntactically-invalid: {_zip_key}", status=400, mimetype="text/plain");
	
	return flask.send_file(f"./backend/packaged-app-code/{ _zip_key }.zip");