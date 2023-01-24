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

function container ()
{
	var valid = true;

	function getUtilities ()
	{
		var utilNames = [ "Utilities_Container" ]; //array of util names
		var utilFiles = []; //array of util files
		//check for dev mode
		var devUtilitiesPreferenceFile = File( "~/Documents/script_preferences/dev_utilities.txt" );
		function readDevPref ( dp ) { dp.open( "r" ); var contents = dp.read() || ""; dp.close(); return contents; }
		if ( devUtilitiesPreferenceFile.exists && readDevPref( devUtilitiesPreferenceFile ).match( /true/i ) )
		{
			$.writeln( "///////\n////////\nUsing dev utilities\n///////\n////////" );
			var devUtilPath = "~/Desktop/automation/utilities/";
			utilFiles = [ devUtilPath + "Utilities_Container.js", devUtilPath + "Batch_Framework.js" ];
			return utilFiles;
		}

		var dataResourcePath = customizationPath + "Library/Scripts/Script_Resources/Data/";

		for ( var u = 0; u < utilNames.length; u++ )
		{
			var utilFile = new File( dataResourcePath + utilNames[ u ] + ".jsxbin" );
			if ( utilFile.exists )
			{
				utilFiles.push( utilFile );
			}

		}

		if ( !utilFiles.length )
		{
			alert( "Could not find utilities. Please ensure you're connected to the appropriate Customization drive." );
			return [];
		}


		return utilFiles;

	}
	var utilities = getUtilities();

	for ( var u = 0, len = utilities.length; u < len && valid; u++ )
	{
		eval( "#include \"" + utilities[ u ] + "\"" );
	}

	if ( !valid || !utilities.length ) return;

	DEV_LOGGING = user === "will.dowling";

	logDest.push( changeCodeLog );


	///////Begin/////////
	///Logic Container///
	/////////////////////

	function getNewInfo ()
	{
		if ( newData.found )
		{
			return;
		}

		var docRef, layers, garLay, garLayText, garCodeText, garDescText;
		docRef = app.activeDocument;
		layers = docRef.layers;
		garLay = layers[ 0 ];
		var infoLay = garLay.layers[ "Information" ];
		garLayText = garLay.name.replace( /_[\d]{3,}.*$/, "" );
		garCodeText = infoLay.textFrames[ "Garment Code" ].contents;
		garDescText = infoLay.textFrames[ "Garment Description" ].contents;



		var w = new Window( "dialog", "Enter New Information" );
		var topText = UI.static( w, "Enter New Information" );
		var inputGroup = UI.group( w );
		inputGroup.orientation = "column";
		var layerNameGroup = UI.group( inputGroup );
		layerNameGroup.orientation = "row";
		var layerNameDisp = UI.static( layerNameGroup, "Layer Name: (No Style Number)" );
		var layerNameInput = UI.edit( layerNameGroup, garLayText );
		layerNameInput.characters = 10;
		var garCodeGroup = UI.group( inputGroup );
		garCodeGroup.orientation = "row";
		var garCodeDisp = UI.static( garCodeGroup, "Garment Code: (Top Right Corner of Mockup)" );
		var garCodeInput = UI.edit( garCodeGroup, garCodeText.replace( /_\d{3,}$/i, "" ) );
		garCodeInput.characters = 20;
		var garDescGroup = UI.group( inputGroup );
		garDescGroup.orientation = "row";
		var garDescDisp = UI.static( garDescGroup, "Garment Description: (Below Garment Code)" );
		var garDescInput = UI.edit( garDescGroup, garDescText );
		garDescInput.characters = 30;
		var btnGroup = UI.group( w );
		var cancelBtn = UI.button( btnGroup, "Cancel", function ()
		{
			valid = false;
			w.close();
		} );
		var submitBtn = UI.button( btnGroup, "Submit", function ()
		{
			if ( validate() )
			{
				newData.lay = layerNameInput.text.replace( "_", "-" );
				newData.code = garCodeInput.text;
				newData.desc = garDescInput.text;
				newData.found = 1;
				w.close();
			}
		} )
		w.show();


		function validate ()
		{
			var uiValid = true;
			var uiValidMsg = [];
			if ( layerNameInput.text === "" )
			{
				uiValid = false;
				uiValidMsg.push( "Layer Name field cannot be empty." );
			}
			if ( !properCodePattern.test( layerNameInput.text ) )
			{
				uiValid = false;
				uiValidMsg.push( "Invalid Layer Name." );
			}

			if ( garCodeInput.text === "" )
			{
				uiValid = false;
				uiValidMsg.push( "Garment Code field cannot be empty." );
			}

			if ( garDescInput.text === "" )
			{
				uiValid = false;
				uiValidMsg.push( "Garment Description field cannot be empty." );
			}

			if ( uiValid )
			{
				return true;
			}
			else
			{
				alert( "The following issues need to be fixed before proceeding:\n" + uiValidMsg.join( "\n" ) );
				return false;
			}
		}
	}

	function changeCode ( lay, code, desc )
	{
		var docRef = app.activeDocument;
		var layers = docRef.layers;
		var garLay = layers[ 0 ];
		var info = garLay.layers[ "Information" ];
		var infoGarCode = info.textFrames[ "Garment Code" ];
		var infoGarDesc = info.textFrames[ "Garment Description" ];
		info.locked = false;
		styleNum = getStyleNum( garLay.name );
		infoGarCode = info.textFrames[ "Garment Code" ];
		infoGarDesc = info.textFrames[ "Garment Description" ];

		garLay.name = lay + "_" + styleNum;
		infoGarCode.contents = code + "_" + styleNum;
		infoGarDesc.contents = desc;
		info.locked = true;
	}

	function exec ()
	{
		if ( !newData.found )
		{
			getNewInfo();
		}
		changeCode( newData.lay, newData.code, newData.desc );
	}


	////////End//////////
	///Logic Container///
	/////////////////////

	var newData = {
		found: 0,
		lay: "",
		code: "",
		desc: ""
	}

	var properCodePattern = /[FP][DS][-_][\da-z]{3,4}/i;

	if ( valid )
	{
		batchInit( exec, "Updated layer names, garment codes, and garment descriptions on mockups." )
	}

	printLog();
}
container();