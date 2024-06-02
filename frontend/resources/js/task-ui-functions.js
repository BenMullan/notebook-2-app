/*
	File:	task-ui-functions.js - Functions for individual "task-ui" slot-in components
	Author:	Ben Mullan 2024 for ((redacted)) 
*/




/*
	task-ui-1-select-notebook.xml
*/

function tui_1_show_workspace_contents() {
	
	/*
		Ensure specified username is syntactically-valid
		Hide #tui-1-databricks-auth, show #tui-1-workspace-contents-listing,
		 fade #task-ui-content-div out, & fade #task-box-loading-indicator in
		GET /api/get-databricks-dir-listing?databricks-path={ #tui-1-databricks-username-textbox }
		Process returned JSON, constructing #tui-1-workspace-contents-listing
		Fade #task-box-loading-indicator out, & fade #task-ui-content-div in
	*/
	
	clear_error();
	ensure_non_fatal($("#tui-1-databricks-username-textbox").get(0).checkValidity(), "The specified username is not syntactically-valid");
	
	$("#task-box-loading-text").text("Retreiving avaliable notebooks...");
	
	$("#tui-1-next-button").fadeOut(
		"fast",
		() => {
			$("#task-ui-content-div").fadeOut(
				"fast",
				() => {
		
					$("#task-box-loading-indicator").fadeIn("fast");
					$("#tui-1-databricks-auth").hide();
					$("#tui-1-workspace-contents-listing").show();
					
					// Initially, load the user's home dir.
					// Then, the user can use the loaded hrefs to navigate upstream/downstream the Databricks' workspace
					tui_1_load_databricks_dir_in_file_browser(`/Workspace/Users/${ $("#tui-1-databricks-username-textbox").val().trim() }@((redacted)).co.uk/`);
					
				}
			);			
		}
	);
	
}

function tui_1_load_databricks_dir_in_file_browser(_databricks_workspace_path) {
	
	/*
		To be called when #tui-1-workspace-contents-listing has already been show()n by tui_1_show_workspace_contents()
		Makes a Databricks API request for the contents of the _databricks_workspace_path (e.g. "/Workspace/Users/ben.mullan@((redacted)).co.uk")
		Then renders this content as folders & notebooks in #tui-1-workspace-contents-listing
	*/
	
	clear_error();
	
	$("#task-ui-content-div").hide()
	$("#task-box-loading-indicator").fadeIn("fast")
	$("#tui-1-workspace-contents-listing").html("");
	
	$.get(
		`/api/get-databricks-dir-listing?databricks-path=${ encodeURIComponent(_databricks_workspace_path) }`,
		(_res_json, _res_status) => {
			
			ensure(_res_status === "success", "Databricks' API error; " + _res_status);
			
			/*
				We now have a Databricks' API response; a dir-listing of a workspace folder.
				Print the folder path with clickable href "breadcrumbs" at the top, and
				 add an <li/> for each DIRECTORY, then for each NOTEBOOK with language PYTHON.
			*/
			
			tui_1_render_breadcrumbs(_databricks_workspace_path);
			
			const _dir_objects = _res_json["objects"] ?? [];
			
			_dir_objects.sort(
				(a, b) => a["object_type"].localeCompare(b["object_type"])
			);
			
			tui_1_render_dir_contents(_dir_objects);
			
			$("#task-box-loading-indicator").fadeOut(
				"fast",
				() => $("#task-ui-content-div").fadeIn("fast")
			);
			
		}
	).fail(
		(_jq_xhr, _res_status, _error_thrown) => {
			show_error(`There was a problem requesting the contents of the directory "${_databricks_workspace_path}" \n\n (${_res_status}, ${ _error_thrown.escape_xml_chars() }) ${ _jq_xhr.responseText.escape_xml_chars() } \n\n Was the username (e.g. "ben.mullan") correct? \n Is the specified databricks-API-key (in /backend/server_code/secrets.py) valid?`);
			$("#task-ui-mountpoint, #task-ui-content-div").fadeIn("slow");
		}
	);
	
}

function tui_1_render_breadcrumbs(_databricks_workspace_path) {
	
	const _breadcrumbs_with_split_indicies = split_to_fragments_and_end_indicies(_databricks_workspace_path, "/");
			
	$("#tui-1-workspace-contents-listing").append(
		`<div class="tui-1-workspace-dir-breadcrumbs">
			${
				[
					[`<i class="bi bi-house-fill" />`, 0],
					..._breadcrumbs_with_split_indicies.map(_breadcrumb_and_end_index => [_breadcrumb_and_end_index[0].escape_xml_chars(), _breadcrumb_and_end_index[1]])
				].map(
					_breadcrumb_and_end_index =>
						`<span>
							<a
								href="javascript:tui_1_load_databricks_dir_in_file_browser('${ _databricks_workspace_path.slice(0, _breadcrumb_and_end_index[1] + 1).escape_xml_chars() }');"
								title="Back to this folder..."
							>
								${ _breadcrumb_and_end_index[0] }
							</a>
						</span>`
				).join(
					`<span class="px-1"> / </span>`
				)
			}
		</div>`
	);
	
}

function tui_1_render_dir_contents(_dir_objects) {
	
	for (_workspace_object of _dir_objects) {
		
		if (_workspace_object["object_type"] == "DIRECTORY") {
			
			const _folder_name = _workspace_object["path"].split("/").at(-1);
			
			$("#tui-1-workspace-contents-listing").append(
				`<li class="tui-1-workspace-object">
					<a
						href="javascript:tui_1_load_databricks_dir_in_file_browser('${ _workspace_object["path"].escape_xml_chars() }');"
						title="Look inside this folder..."
					>
						${ /\w+\.\w+@.*/.test(_folder_name) ? "👨‍💼" : "📂" }
						${ _folder_name.escape_xml_chars() }/
					</a>
				</li>`
			);
			
		} else if ((_workspace_object["object_type"] == "NOTEBOOK") && (_workspace_object["language"] == "PYTHON")) {
			
			$("#tui-1-workspace-contents-listing").append(
				`<li class="tui-1-workspace-object">
					<a
						href="javascript:tui_1_select_target_notebook('${ _workspace_object["path"].escape_xml_chars() }');"
						title="Continue with this notebook..."
					>
						📝 ${ _workspace_object["path"].split("/").at(-1).escape_xml_chars() }
					</a>
				</li>`
			);
			
		}
		
	}
	
	if ($("#tui-1-workspace-contents-listing > .tui-1-workspace-object").length === 0) {
		$("#tui-1-workspace-contents-listing").append(
			`<p class="off-grey">(No python notebooks here...)</p>`
		);
	}
	
}

function tui_1_select_target_notebook(_notebook_path) {
	
	/*
		The user has now browsed through the Databricks' Workspace
		 to find their target python notebook (whose full path we
		 have just received in `_notebook_path`). Next, move to
		 `task-ui-2-select-required-cells`, which will make the API
		 request `/api/get-notebook-cells`.
		
		Pass the selected-notebook's path to the next task-ui,
		 by `window.tui_1_selected_notebook_path`.
	*/
	
	console.debug(`%c Selected target notebook: ${ _notebook_path }`, "color: blue;");
	
	window.tui_1_selected_notebook_path = _notebook_path;
	window.task_uis.load_next_task();
	
}






/*
	task-ui-2-select-required-cells
	Uses: window.tui_1_selected_notebook_path
*/

function tui_2_show_notebook_cells() {
	
	/*
		Make request to /api/get-notebook-cells
		Render each cell as an <li> inside #tui-2-notebook-cells-list
			Markdown cells; just as plaintext; no checkbox
			Python cells; with syntax-highlighting; with checkbox
		Show the [→] button, so the user can submit the ticked cells.
	*/
	
	ensure(window.tui_1_selected_notebook_path != null, "No notebook has been selected yet");
	
	$("#task-box-loading-text").text("Downloading notebook cells...");
	$("#task-box-loading-indicator").fadeIn("fast");
	
	$.get(
		`/api/get-notebook-cells?notebook-path=${ encodeURIComponent(window.tui_1_selected_notebook_path) }`,
		(_res_json, _res_status) => {
			
			ensure(_res_status === "success", "Databricks' API error; " + _res_status);
			tui_2_render_cells_from_json(_res_json);
			
			$(".task-box").css(
				{
					"height" : $(".task-box").css("max-height"),
					"width"  : $(".task-box").css("min-width")
				}
			);
			
			$("#task-box-loading-indicator").fadeOut(
				"fast",
				() => $("#task-ui-content-div, #tui-2-next-button").fadeIn("slow")
			);
			
		}
	).fail(
		(_jq_xhr, _res_status, _error_thrown) => {
			show_error(`There was a problem loading the notebook "${ window.tui_1_selected_notebook_path }" \n\n (${_res_status}, ${ _error_thrown.escape_xml_chars() }) ${ _jq_xhr.responseText.escape_xml_chars() }`);
			$("#task-ui-mountpoint, #task-ui-content-div").fadeIn("slow");
		}
	);
	
}

function tui_2_render_cells_from_json(_notebook_ipynb_json) {
	
	for (_cell_index in _notebook_ipynb_json["cells"]) {
		
		const _current_cell = _notebook_ipynb_json["cells"][_cell_index];
		const _cell_text = _current_cell["source"].join("").slice(0, 100).escape_xml_chars() + (
			(_current_cell["source"].join("").length > 100) ? "..." : ""
		);
		
		$("#tui-2-notebook-cells-list").append(
			`<li class="container">
				<div class="row me-2" onclick="event.target.parentNode.parentNode.parentNode.querySelector(&quot;[data-cell-index='${_cell_index}']&quot;).checked ^= 1;">
					<span class="col-1">
						${
							(_current_cell["cell_type"] === "code")
							? `<input type="checkbox" class="form-check-input" data-cell-index="${_cell_index}" />`
							: ``
						}
					</span>
					<span class="col-1 off-grey px-2"> ${_cell_index} </span>
					${
						(_current_cell["cell_type"] === "code")
						? `<pre  class="col-10 tui-2-notebook-cell"><code class="language-python">${ _cell_text }</code></pre>`
						: `<span class="col-10 tui-2-notebook-cell">${ _cell_text }</span>`
					}
				</div>
			</li>`
		);
		
	}
	
	hljs.highlightAll();
	
}

function tui_2_set_selected_cells() {
	
	/*
		Sets `window.tui_2_selected_cells_indicies` to e.g. [0, 3, 4]
		Advances to the next task-ui (3; generate-app-code)
	*/
	
	window.tui_2_selected_cells_indicies = [...$("[data-cell-index]")]
		.filter(_checkbox => _checkbox.checked)
		.map(_checkbox => _checkbox.getAttribute("data-cell-index"))
	;
	
	console.debug(`%c Selected notebook cells: ${ window.tui_2_selected_cells_indicies }`, "color: green;");
	window.task_uis.load_next_task();
	
}






/*
	task-ui-3-generate-app-code
	Uses: window.tui_1_selected_notebook_path, window.tui_2_selected_cells_indicies
*/

function tui_3_show_initial_app_code() {
	
	/*
		Here, we have a target-notebook, and a list of selected-cells (whose source
		 will now form the app-code). Next, request `/api/generate-app-code`, and
		 render the response into the #tui-3-code-editor. Then add the code-suggestion
		 dialogs.
	*/
	
	ensure(window.tui_1_selected_notebook_path != null, "No notebook has been selected yet");
	ensure(window.tui_2_selected_cells_indicies != null, "Notebook cells haven't been selected yet");
	
	$("#task-ui-mountpoint").fadeOut("fast");
	$("#task-ui-outer-div").fadeOut("fast");
	$("#task-box-loading-text").text("Generating and scanning app-code...");
	$("#task-box-loading-indicator").fadeIn("slow");
	
	$.get(
		`/api/generate-app-code?notebook-path=${ encodeURIComponent(window.tui_1_selected_notebook_path) }&selected-cells=${ window.tui_2_selected_cells_indicies.join(",") }`,
		(_res_json, _res_status) => {
			
			ensure(_res_status === "success", "Databricks' API error; " + _res_status);
			
			tui_3_render_appcode_into_editor(_res_json["mainpy_code"]);
			
			tui_3_render_code_sidebar_items(_res_json["code_stats"], _res_json["code_suggestions"]);
			
			$("#task-box-loading-indicator").fadeOut(
				"fast",
				() => {
					$("#task-ui-outer-div").fadeIn("slow");
					$("#task-ui-mountpoint").fadeIn("slow");
				}
			);
			
		}
	).fail(
		(_jq_xhr, _res_status, _error_thrown) => {
			show_error(`There was a problem generating the app-code for "${ window.tui_1_selected_notebook_path }" \n\n (${_res_status}, ${ _error_thrown }) ${ _jq_xhr.responseText }`);
			$("#task-ui-mountpoint, #task-ui-content-div").fadeIn("slow");
		}
	);
	
}

function tui_3_render_appcode_into_editor(_appcode_string) {
	
	require.config({ paths : { "vs" : "https://unpkg.com/monaco-editor@latest/min/vs" }});
	window.MonacoEnvironment = { getWorkerUrl : () => proxy };

	let proxy = URL.createObjectURL(
		new Blob(
			[
				`self.MonacoEnvironment = { baseUrl : "https://unpkg.com/monaco-editor@latest/min/" };
				importScripts("https://unpkg.com/monaco-editor@latest/min/vs/base/worker/workerMain.js");`
			],
			{ type : "text/javascript" }
		)
	);

	require(
		["vs/editor/editor.main"],
		function () {
			window.tui_3_monaco_editor = monaco.editor.create(
				$("#tui-3-code-editor").get(0),
				{
					value			: _appcode_string,
					language		: "python",
					automaticLayout	: true,
					minimap			: { enabled : false },
					mouseWheelZoom	: true
				}
			);
		}
	);
	
	$(".task-box").css(
		{
			"height" : $(".task-box").css("max-height"),
			"width"  : $(".task-box").css("max-width")
		}
	);
	
}

function tui_3_render_code_sidebar_items(_code_stats_json, _code_suggestions_json) {
	
	/*
		`_code_stats_json` looks like e.g.
			{ "line_count":, "comment_line_count":, "maintainability_index": }
		
		`_code_suggestions_json` looks like e.g.
			[
				{ "message" : "Replace plot.show() with Dash server.",
				 "target_range" : { "startLineNumber" : 4, "startColumn" : 8, "endLineNumber" : 4, "endColumn" : 13 },
				 "replacement" : "serve()" }
			]
	*/
	
	$("#tui-3-code-analytics-sidebar").append(
		`<div class="accordion-item" id="tui-3-code-stats-accordion-item">
			<h2 class="accordion-header">
				<button class="accordion-button" data-bs-toggle="collapse" data-bs-target="#tui-3-code-stats" aria-expanded="true" aria-controls="tui-3-code-stats">
					📊 Code Statistics
				</button>
			</h2>
			<div id="tui-3-code-stats" class="accordion-collapse collapse show" data-bs-parent="#tui-3-code-analytics-sidebar">
				<div class="accordion-body">
					
					<ul>
						<li title="How lengthy your code is">Line Count: ${ _code_stats_json["line_count"] } <br/> Comment lines: ${ _code_stats_json["comment_line_count"] } </li>
						<li title="Higher is better! Between 0 to 100.">Maintainability Index: ${ _code_stats_json["maintainability_index"] }</li>
					</ul>
					
				</div>
			</div>
		</div>`
	);
	
	for (_suggestion of _code_suggestions_json) {
		
		_suggestion_id = `tui-3-code-suggestion-${get_random_string(8)}`;
		
		$("#tui-3-code-analytics-sidebar").append(
			`<div class="accordion-item" id="${_suggestion_id}-accordion-item">
				<h2 class="accordion-header">
					<button
						class="accordion-button"
						data-bs-toggle="collapse"
						data-bs-target="#${_suggestion_id}"
						aria-expanded="false"
						aria-controls="${_suggestion_id}"
						onclick="tui_3_editor_set_highlighted_range( JSON.parse('${ JSON.stringify(_suggestion["target_range"]).escape_xml_chars() }') );"
					>
						${ _suggestion["message"].slice(0, 22) } ...
					</button>
				</h2>
				<div id="${_suggestion_id}" class="accordion-collapse collapse" data-bs-parent="#tui-3-code-analytics-sidebar">
					<div class="accordion-body">
						
						<p>${ _suggestion["message"] }</p>
						
						${
							_suggestion["replacement"] === ""
							?
								``
							:
								`<button
									class="btn btn-success py-1 px-2 mx-1"
									onclick="tui_3_editor_replace_text_in_range( JSON.parse('${ JSON.stringify(_suggestion["target_range"]).escape_xml_chars() }'), &quot;${ _suggestion["replacement"].replaceAll("\"", "'").replaceAll("\n", "\\n").escape_xml_chars() }&quot; ); $('#${_suggestion_id}-accordion-item').fadeOut();"
								>
									<i class="bi bi-check" /> Apply
								</button>
								
								<button
									class="btn btn-danger py-1 px-2 mx-1"
									onclick="$('#${_suggestion_id}-accordion-item').fadeOut();"
								>
									<i class="bi bi-x" /> Ignore
								</button>`
						}
						
					</div>
				</div>
			</div>`
		);
		
	}
	
	$("#tui-3-code-stats-accordion-item .accordion-button").click();
	
}

window.tui_3_monaco_editor_applied_decorations = [];

function tui_3_editor_set_highlighted_range(_range_object) {
	
	/*
		`_range_object` looks like e.g.
			{
				"startLineNumber"	: 4,
				"startColumn"		: 8,
				"endLineNumber"		: 4,
				"endColumn"			: 13
			}
			
		Create using `new monaco.Range()`
	*/
	
	tui_3_editor_clear_all_highlighting();
	
	window.tui_3_monaco_editor_applied_decorations = window.tui_3_monaco_editor.deltaDecorations(
		window.tui_3_monaco_editor_applied_decorations,
		[
			{
				range	: _range_object,
				options	: {
					isWholeLine		: false,
					inlineClassName	: "tui-3-editor-text-highlighted"
				}
			}
		]
	);
	
	window.tui_3_monaco_editor.revealLineInCenter(
		_range_object["startLineNumber"]
	);
	
	console.debug(`Set highlighted range to: ${ JSON.stringify(_range_object) }`);
	
}

function tui_3_editor_clear_all_highlighting() {
	
	window.tui_3_monaco_editor_applied_decorations = window.tui_3_monaco_editor.deltaDecorations(
		window.tui_3_monaco_editor_applied_decorations,
		[]
	);
	
}

function tui_3_editor_replace_text_in_range(_range_object, _new_text) {
	
	window.tui_3_monaco_editor.executeEdits(
		"n2a-code-suggestion",
		[
			{
				range	: _range_object,
				text	: _new_text
			}
		]
	);
	
}

function tui_3_submit_edited_app_code() {
	
	/*
		POST the edited app-code to /api/submit-edited-app-code
			This endpoint should respond with a zip-file key like "h40ddjl293jdjf8"
			This path is stored as `window.tui_3_appcode_package_key`
		Move to next task
	*/

	$("#task-ui-mountpoint").fadeOut(
		"fast",
		() => {
			$("#task-box-loading-text").text("Packaging app-code...");
			$("#task-box-loading-indicator").fadeIn("slow");
		}
	);
	
	$.post(
		"/api/submit-edited-app-code",
		{ "edited-app-code" : window.tui_3_monaco_editor.getValue() },
		(_res_json, _res_status) => {
			
			ensure(_res_status === "success", "Databricks' API error; " + _res_status);
			window.tui_3_appcode_package_key = _res_json["appcode-package-key"];
			
			console.debug(`%c Saved appcode with package-key: ${ window.tui_3_appcode_package_key }`, "color: orange;");
			window.task_uis.load_next_task();
			
		}
	).fail(
		(_jq_xhr, _res_status, _error_thrown) => {
			show_error(`There was a problem packaging the app-code for "${ window.tui_1_selected_notebook_path }" \n\n (${_res_status}, ${ _error_thrown }) ${ _jq_xhr.responseText }`);
			$("#task-ui-mountpoint, #task-ui-content-div").fadeIn("slow");
		}
	);

}






/*
	task-ui-4-download-app-code
	Uses: window.tui_3_appcode_package_key
*/

function tui_4_populate_appcode_download_link_details() {
	
	$("#tui-4-appcode-download-link").attr(
		"href",
		`/api/download-app-code-package?zip-key=${ window.tui_3_appcode_package_key }`
	);
	
	$("#tui-4-appcode-package-name-text").text(`${window.tui_3_appcode_package_key}.zip`);
	
	$(".task-box").css(
		{
			"height" : $(".task-box").css("min-height"),
			"width"  : $(".task-box").css("min-width")
		}
	);
	
}