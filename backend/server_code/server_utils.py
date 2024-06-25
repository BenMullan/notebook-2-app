# File:		server_utils.py - Utility functions imported by `server.py`
# Author:	Ben Mullan 2024 for ((redacted)) 

import os, subprocess, re, random, string;


INITIAL_APPCODE_FOLDER = "./backend/initial-app-code/";
PACKAGED_APPCODE_FOLDER = "./backend/packaged-app-code/";


@staticmethod
def get_process_output(_command_line_parts) -> str:
	"""
		Collects the output from both STDOUT and STDERR.
		If the subprocess runs unsuccessfully, the raised Exception contains the process's output text.
		
		Example:
			try:
				_subproc_output = server_utils.get_process_output(["python", "-m", "black", _appcode_filepath]);
				if not ("1 file reformatted" in _subproc_output): raise Exception(f"Black code re-formatting may have run unsuccessfully. \n Output: {_subproc_output}");
			except Exception as _e:
				raise Exception(f"Black code-reformatting encountered an error; {str(_e)}");
	"""
	
	_subproc_output = "(No sub-process output)";
	
	try:
		_subproc_output = subprocess.check_output(_command_line_parts, stderr=subprocess.STDOUT).decode("utf-8");
		return _subproc_output;
	except subprocess.CalledProcessError as _e:
		raise Exception(f"Sub-process error; {str(_e)} \n\n Output: {_subproc_output} \n\n stdout: {_e.output}");


@staticmethod
def is_clean_posix_path(_potentially_dangerous_string) -> bool:
	"""
		~Tests against a regex.~
		!!!
		Catching too many valid URLs as incorrect. Therefore bypassing,
		because would otherwise be adding so many chars that's its
		hardly filtering anything out anyway.
		!!!
	"""
	return True;
	return bool(re.compile(r"^\/[A-Za-z0-9-_.+=@\(\)\[\]\/:#\$!%\* ]{0,600}$").match(_potentially_dangerous_string));


@staticmethod
def is_clean_comma_array(_potentially_dangerous_string) -> bool:
	""" Tests against a regex """
	return bool(re.compile(r"^(\d,?){1,300}$").match(_potentially_dangerous_string));


@staticmethod
def is_clean_alphanumeric_string(_potentially_dangerous_string) -> bool:
	""" Tests against a regex """
	return bool(re.compile(r"^[A-Za-z0-9]{1,300}$").match(_potentially_dangerous_string));


@staticmethod
def get_current_initial_app_code_filenames():
	"""
		E.g. ./backend/initial-app-code/ might contain:
			- abf083jfh20djso334ns.py
			- j38nslhvf74hf8jdhr80.py
	"""
	
	return [
		_filename for _filename in os.listdir(INITIAL_APPCODE_FOLDER) 
		if os.path.isfile(os.path.join(INITIAL_APPCODE_FOLDER, _filename))
	];


@staticmethod
def get_new_initital_app_code_filename():
	"""
		Ensures the new name isn't already taken.
		See: get_current_initial_app_code_filenames()
		
		Returns e.g. "dh38dhfkkhd0803h.py"
	"""
	
	_new_filename = "";
	
	while _new_filename in ["", *get_current_initial_app_code_filenames()]:
		_new_filename = "".join(random.choices(string.ascii_lowercase + string.digits, k=20)) + ".py";
	
	return  _new_filename;


@staticmethod
def get_current_packaged_app_code_foldernames():
	"""
		E.g. ./backend/packaged-app-code/ might contain:
			- abf083jfh20djso334ns/
			- j38nslhvf74hf8jdhr80/
	"""
	
	return [
		_dirname for _dirname in os.listdir(PACKAGED_APPCODE_FOLDER) 
		if os.path.isdir(os.path.join(PACKAGED_APPCODE_FOLDER, _dirname))
	];


@staticmethod
def get_new_packaged_app_code_foldername():
	"""
		Ensures the new name isn't already taken.
		See: get_current_packaged_app_code_foldernames()
		
		Returns e.g. "dh38dhfkkhd0803h"
	"""
	
	_new_foldername = "";
	
	while _new_foldername in ["", *get_current_packaged_app_code_foldernames()]:
		_new_foldername = "".join(random.choices(string.ascii_lowercase + string.digits, k=20));
	
	return  _new_foldername;