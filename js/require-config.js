require.config({
    paths: {
        "vs": "lib/monaco-editor/min/vs"
    }
});
require(["vs/editor/editor.main"], function (m) {
    require(["./editor"], function (editorModule) {
		var Editor = new EditorViewModel();
		Editor.selectEntity(null);
		Editor.eventViewModel.initEditor();
    });
});
