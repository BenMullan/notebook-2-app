/*
	File:	main.js - Scripts for `notebook-2-app` pipeline application
	Author:	Ben Mullan 2024 for ((redacted)) 
*/


// From main.scss
const c_blue_primary	= "#3385ff";
const c_blue_secondry	= "#cce1ff";


// Task User-Interfaces
window.task_uis = {
	
	current_task_ui_index: -1,
	
	urls: [
		"/task-uis/task-ui-1-select-notebook.xml",
		"/task-uis/task-ui-2-select-required-cells.xml",
		"/task-uis/task-ui-3-generate-app-code.xml",
		"/task-uis/task-ui-4-download-app-code.xml"
	],
	
	load_next_task: function () {
		
		ensure(window.task_uis.current_task_ui_index < (window.task_uis.urls.length - 1), "The final task has already been reached");
		++ window.task_uis.current_task_ui_index;
		
		/*
			Fade the #task-ui-mountpoint out, then fade the loading-indicator in
			GET the task-ui XML, then...
				Fade the #task-box-title out, then set its text, then fade it back in
				Fade the progress-bubbles out, then set the correct one to dark-blue, then fade them back in
				Fade the loading-indicator back out, then fade the #task-ui-mountpoint back in
		*/
		
		$("#task-box-loading-text").text("Loading Task UI...");
		
		$("#task-ui-mountpoint").fadeOut(
			"fast",
			() => $("#task-box-loading-indicator").fadeIn("fast")
		);
		
		$("#task-ui-mountpoint").load(
			window.task_uis.urls[window.task_uis.current_task_ui_index],
			function (_res_text, _res_status) {
				
				ensure(_res_status === "success", "Couldn't load Task UI; " + _res_status);
				const _task_ui_xml = $($.parseXML(_res_text)).find(".task-ui-outer-div");
				
				$("#task-box-title").fadeOut(
					"fast",
					() => { $("#task-box-title").text(_task_ui_xml.attr("data-task-title")); $("#task-box-title").fadeIn("slow"); }
				);
				
				$("#task-box-progress-bubbles").fadeOut(
					"slow",
					() => {
						$("#task-box-progress-bubbles > li").css("background-color", c_blue_secondry);
						$(`#task-box-progress-bubbles > li:contains(${ _task_ui_xml.attr("data-task-number") })`).css("background-color", c_blue_primary);
						$("#task-box-progress-bubbles").fadeIn("slow");
					}
				);
				
				$("#task-box-loading-indicator").fadeOut(
					"slow",
					() => $("#task-ui-mountpoint").fadeIn("slow")
				);
				
			}
		);
		
	}
	
};