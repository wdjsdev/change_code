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

#target Illustrator
function container(folderPath,newLayName,newGarCode,newGarDesc)
{

	function getUtilities()
	{
		var result = [];


		var utilPath = "/Volumes/Customization/Library/Scripts/Script_Resources/Data/";
		var ext = ".jsxbin";

		//check for dev utilities preference file
		var devUtilitiesPreferenceFile = File("~/Documents/script_preferences/dev_utilities.txt");

		if(devUtilitiesPreferenceFile.exists)
		{
			devUtilitiesPreferenceFile.open("r");
			var prefContents = devUtilitiesPreferenceFile.read();
			devUtilitiesPreferenceFile.close();
			if(prefContents.match(/true/i))
			{
				utilPath = "~/Desktop/automation/utilities/";
				ext = ".js";
			}
		}

		if($.os.match("Windows"))
		{
			utilPath = utilPath.replace("/Volumes/","//AD4/");
		}

		result.push(utilPath + "Utilities_Container" + ext);
		result.push(utilPath + "Batch_Framework" + ext);


		if(!result.length)
		{
			valid = false;
			alert("Failed to find the utilities.");
		}
		return result;

	}

	var utilities = getUtilities();
	for(var u=0,len=utilities.length;u<len;u++)
	{
		eval("#include \"" + utilities[u] + "\"");	
	}



	///////Begin/////////
	///Logic Container///
	/////////////////////



	function changeCode(lay,code,desc)
	{
		var docRef = app.activeDocument;
		var layers = docRef.layers;
		var garLay = layers[0];
		var info = garLay.layers["Information"];
		var infoGarCode = info.textFrames["Garment Code"];
		var infoGarDesc = info.textFrames["Garment Description"];
		info.locked = false;
		styleNum = getStyleNum(garLay.name);
		infoGarCode = info.textFrames["Garment Code"];
		infoGarDesc = info.textFrames["Garment Description"];

		if(lay)
		{
			garLay.name = lay + "_" + styleNum;
		}

		if(code)
		{
			infoGarCode.contents = code + "_" + styleNum;	
		}
		
		if(desc)
		{
			infoGarDesc.contents = desc;
		}

		info.locked = true;
	}

	function exec()
	{
		changeCode(newLayName,newGarCode,newGarDesc);
	}


	////////End//////////
	///Logic Container///
	/////////////////////



	batchInit(exec,"",folderPath);
	

}

function doTheThing()
{
	var batchFolders = ["FD-161G_Raglan SS Crewneck", "FD-163G_Regular SS Crewneck", "FD-170G_Regular SS V-Neck", "FD-240G_Regular FB SS", "FD-243G_FB SL", "FD-246G_2B SS", "FD-4416G_SS V-Necks"];
	const folderPrefix = "~/Desktop/Girls Fastpitch/";

	for(var x=0;x<batchFolders.length;x++)
	{
		// container(folderPrefix + batchFolders[x] + "/", batchFolders[x].match(/(^.*)_/)[1], undefined, undefined);
		container(folderPrefix + batchFolders[x] + "/", batchFolders[x].match(/^[^_]*/)[0], undefined, undefined);
	}
}
doTheThing();