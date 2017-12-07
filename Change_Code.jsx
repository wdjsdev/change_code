/*
	Component Name: Change Code
	Author: William Dowling
	Creation Date: 15 September, 2017
	Description: 
		Update the garment code, description and layer name
		of one document or all open documents
	Arguments
		none
	Return value
		success boolean

*/

function container()
{
	var valid = true;
	eval("#include \"/Volumes/Customization/Library/Scripts/Script Resources/Data/Utilities_Container.jsxbin\"");



	///////Begin/////////
	///Logic Container///
	/////////////////////

	function batchPrompt()
	{
		/* beautify ignore:start */
		var w = new Window("dialog", "Current Document or All Documents?");

			//layer name
			var nlnGroup = w.add("group");
				var nlnMsg = nlnGroup.add("statictext", undefined, "Enter the layer name (no style number): ");
				var nlnInput = nlnGroup.add("edittext", undefined, garCode);
					nlnInput.characters = 20;

			//garment code
			var ngcGroup = w.add("group");
				var ngcMsg = ngcGroup.add("statictext", undefined, "(Top Right Corner of Mockup)");
				var ngcMsg2 = ngcGroup.add("statictext", undefined, "Enter the Garment Code:");
				var ngcInput = ngcGroup.add("edittext", undefined, garCode);
					ngcInput.characters = 30;

			//garment description
			var ngdGroup = w.add("group");
				var ngdMsg = ngdGroup.add("statictext", undefined, "Enter the garment description:");
				var ngdInput = ngdGroup.add("edittext", undefined, infoGarDesc.contents);
					ngdInput.characters = 30;

			//button group
			var btnGroup = w.add("group");
				var oneDoc = btnGroup.add("button", undefined, "Just This Document");
					oneDoc.onClick = function()
					{
						changeCode(nlnInput.text,ngcInput.text,ngdInput.text);
						w.close();
					}
				var allDocs = btnGroup.add("button", undefined, "All Open Documents");
					allDocs.onClick = function()
					{
						while(app.documents.length > 0)
						{
							changeCode(nlnInput.text,ngcInput.text,ngdInput.text);
							app.activeDocument.close(SaveOptions.SAVECHANGES);
						}
						w.close();
					}
				var cancel = btnGroup.add("button", undefined, "Cancel");
					cancel.onClick = function()
					{
						w.close();
					}

		w.show();
	}

	function changeCode(lay,code,desc)
	{
		docRef = app.activeDocument;
		layers = docRef.layers;
		garLay = layers[0];
		info = garLay.layers["Information"];
		info.locked = false;
		styleNum = getStyleNum(garLay.name);
		infoGarCode = info.textFrames["Garment Code"];
		infoGarDesc = info.textFrames["Garment Description"];

		garLay.name = lay + "_" + styleNum;
		infoGarCode.contents = code + "_" + styleNum;
		infoGarDesc.contents = desc;
		info.locked = true;
	}


	////////End//////////
	///Logic Container///
	/////////////////////

	var docRef = app.activeDocument;
	var layers = docRef.layers;
	var garLay = layers[0];
	var info = garLay.layers["Information"];
	var garCode = getCode(garLay.name);
	var styleNum = getStyleNum(garLay.name);
	var infoGarCode = info.textFrames["Garment Code"];
	var infoGarDesc = info.textFrames["Garment Description"];

	if(valid)
	{
		batchPrompt();

	}


}
container();