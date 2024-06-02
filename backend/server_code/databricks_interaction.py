# File:		databricks_interaction.py - Databricks REST API functions imported by `server.py`
# Author:	Ben Mullan 2024 for ((redacted)) 

import sys, os, subprocess, shutil, json, re, datetime, random, string, urllib.request, flask;
from . import secrets;

@staticmethod
def get_notebook_cells_json(_notebook_path):
	"""
		Returns the unmodified Databricks' REST API workspace-contents response.
		_notebook_path: e.g. "/Workspace/utilities/mount container"
	"""
	
	return json.loads(
		make_databricks_api_request(
			"/api/2.0/workspace/export",
			f'{{ "path" : "{_notebook_path}", "format" : "JUPYTER", "direct_download" : "true" }}'
		)
	);
	

@staticmethod
def get_databricks_dir_listing_json(_databricks_path):
	"""
		Returns the unmodified Databricks' REST API workspace-contents response.
		_databricks_path: e.g. "/Workspace/Users/ben.mullan@((redacted)).co.uk"
	"""
	
	return json.loads(
		make_databricks_api_request(
			"/api/2.0/workspace/list",
			f'{{ "path" : "{_databricks_path}" }}'
		)
	);


@staticmethod
def make_databricks_api_request(_api_path, _post_data) -> str:
	"""
		Authenticates & returns the string response from the Databricks' API.
	"""
	
	try:
	
		_request = urllib.request.Request(
			method="GET",
			url=f"https://{secrets.DATABRICKS_HOST}{_api_path}",
			data=_post_data.encode("utf-8")
		);
		
		_request.add_header("Authorization", f"Bearer {secrets.DATABRICKS_ACCESS_TOKEN}");
		_response = urllib.request.urlopen(_request);
		
		return _response.read().decode("utf-8");
		
	except Exception as _request_exception:
		
		raise Exception(f"The Databricks' API Request failed, with error \"{str(_request_exception)}\"");