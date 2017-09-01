/*

Script Name: Change Code
Author: William Dowling
Build Date: 16 Nov, 2016
Description: Change garment code and wearer layer name to new garment code dictated by user.
Build number: 1.0

Progress:

	Version 1.001
		17 Nov, 2016
		Initial build.

	Version 1.002
		20 February, 2017
		Adding the ability to change the garment description as well as code/layer name

		

*/

function container()
{
	////////////////////////////////
	////VERSION/////////////////////
	////////////////////////////////	
	var version = "1.001";

	/*****************************************************************************/

	///////Begin/////////
	///Logic Container///
	/////////////////////

	//sendErrors Function Description
	//Display any errors to the user in a preformatted list
	function sendErrors(errorList)
	{
		var localValid = true;
	
		alert(errorList.join("\n"));
	
	
		return localValid
	}

	//changeCode Function Description
	//Take user input from dialog and update garment code on mockup and layer name to corrected code.
	function changeCode(newCode,newDesc,newLay)
	{
		//getStyleNum Function Description
		//extract the style number of the current garment
		// function getStyleNum()
		// {
		// 	var patlet = /[a-z]/i;
		// 	var patnum = /\d/;
		// 	var lay = layers[0].name;
		// 	var lastUnder = lay.substring(lay.lastIndexOf("_")+1,lay.length);

		// 	if(patnum.test(lastUnder))
		// 	{
		// 		log.l("getStyleNum function is returning " + lastUnder + " as the style number.")
		// 		return lastUnder;
		// 	}
		// 	else if(patlet.test(lastUnder))
		// 	{
		// 		suffix = "_" + lastUnder;
		// 		lay = lay.substring(0,lay.lastIndexOf("_"));
		// 		lastUnder = lay.substring(lay.lastIndexOf("_")+1,lay.length);
		// 		if(patnum.test(lastUnder))
		// 		{
		// 			log.l("getStyleNum function is returning " + lastUnder + " as the style number.")
		// 			return lastUnder;
		// 		}
		// 		else
		// 		{
		// 			log.e("Failed running getStyleNum function.::Tested " + lay + "::lastUnder was " + lastUnder);
		// 			alert("Failed to determine the proper style number.");
		// 			return false;
		// 		}
		// 	}
		// }

		function getStyleNum()
		{
			var numPat = /([a-z]{2}[-_][a-z0-9]*[-_])?(\d{3,4})([-_][a-z])?/i;

			var styleNum = app.activeDocument.layers[0].name.match(numPat)[2];
			if(styleNum.length === 3)
			{
				styleNum = "1" + styleNum;
			}
			return styleNum;
		}

		// //updateCode Function Description
		// //Take User input and use to update garmet code and layer name.
		 function updateCode(newCode,newDesc,newLay)
		 {
		 	var localValid = true;

			
		//Try/Catch Description:
		//set and unlock info layer so it's ready to manipulate
		 	try
		 	{
		 		var info = docRef.layers[0].layers["Information"];
		 		lockUnlock(info,false)
		 	}
		 	catch(e)
		 	{
		 		errorList.push(e);
		 		errorList.push("Failed while unlocking the Information layer");
				log.e("Failed while unlocking the Information layer.::System error message = " + e);
				localValid = false;
			}
			
			if(localValid)
			{		
				//change the garment code
				var garCode = info.textFrames["Garment Code"];	
				garCode.contents = newCode;

				//change layer name
				if(suffix != "")
				{
					layers[0].name = newLay + "_" + styleNum + suffix;
				}
				else
				{
					layers[0].name = newLay + "_" + styleNum;	
				}

				//change the garment description
				var garDesc = info.textFrames["Garment Description"];
				garDesc.contents = newDesc;
			}
			
			


		 	return localValid;
		 }



		//lockUnlock Function Description
		// lock or unlock layer
		function lockUnlock(lay,bool)
		{
			var localValid = true;

			if(lay == undefined || bool == undefined)
			{
				localValid = false;
				errorList.push("Couldn't determine the correct layer to lock or unlock");
				log.e("Failed while trying to lock or unlock a layer.::lay = " + lay + "::bool = " + bool)
			}


			if(localValid)
			{		
				log.l("Attempting to set " + lay.name + ".locked to " + bool);
				//Try/Catch Description:
				//lock or unlock "lay" (the layer that is passed in)
				try
				{
					lay.locked = bool
					log.l("Set locked property of layer " + lay.name + " to " + bool + ".")
				}
				catch(e)
				{
					localValid = false;
					errorList.push(e);
					errorList.push("Unable to set the property of " + lay.name + " to " + bool + ".")
					log.e("Unable to set the property of " + lay.name + " to " + bool + ".");
				}
			}
			
			


			return localValid
		}



		////////End//////////
		///Logic Container///
		/////////////////////



		///////Begin////////
		///Function Calls///
		////////////////////

		var docRef = app.activeDocument;
		var layers = docRef.layers;
		var aB = docRef.artboards;
		var swatches = docRef.swatches;
		var info = layers[0].layers["Information"];
		var suffix = "";

		var valid = true;



		var styleNum = getStyleNum();

		if(newCode.lastIndexOf("_") == newCode.length-1)
		{
			newCode = newCode + styleNum + suffix;
		}
		else
		{
			newCode = newCode + "_" + styleNum + suffix;
		}

		updateCode(newCode,newDesc,newLay);

		////////End/////////
		///Function Calls///
		////////////////////

		/*****************************************************************************/

		if(errorList.length>0)
		{
			sendErrors(errorList);
		}
		return valid

	}

	

	function batchPrompt()
	{

		var info = app.activeDocument.layers[0].layers["Information"];

		var version = "1.002";

		log.h("Running script:::Change_Code.jsx version " + version)

		//new dialog window
		//message, text input and 2 buttons
			//input box for new garment code
			//single document button
			//batch all documents button.
		var w = new Window("dialog","Batch All Open Documents?")
			
			var nlnGroup = w.add("group");
				var msg = nlnGroup.add("statictext", undefined, "Enter the new layer name.");
				var usrInputLayer = nlnGroup.add("edittext", undefined, "eg. FD_217Y");
					usrInputLayer.characters = 20;

			var ngcGroup = w.add("group");
				var msg = ngcGroup.add("statictext", undefined, "Enter the new garment Code.");
				var usrInput = ngcGroup.add("edittext", undefined, "eg. FD_217Y || BM-241");
					usrInput.characters = 30;

			var ngdGroup = 	w.add("group");
				var descMsg = ngdGroup.add("statictext", undefined, "Enter the new garment description.");	
				var descInput = ngdGroup.add("edittext", undefined, info.textFrames["Garment Description"].contents);
					descInput.characters = 30;

			var btnGroup = w.add("group");
				var oneBut = btnGroup.add("button", undefined, "Just this document.");
					oneBut.onClick = function()
					{
						log.l(user + " clicked \"Just this document\"::Running justOne function.::Passing \"" + usrInput.text + "\" as 'newCode' argument.");
						justOne(usrInput.text,descInput.text,usrInputLayer.text);
						w.close();
					}
				var allBut = btnGroup.add("button", undefined, "All open documents.");
					allBut.onClick = function()
					{
						log.l(user + " clicked \"All open documents.\"::Running allDocs function.::Passing \"" + usrInput.text + "\" as 'newCode' argument.");
						allDocs(usrInput.text,descInput.text,usrInputLayer.text);
						w.close();
					}
				var cancelBut = btnGroup.add("button", undefined, "Cancel");
					cancelBut.onClick = function()
					{
						log.h("User cancelled script. Exiting.")
						w.close();
					}
		w.show();




		function allDocs(newCode,newDesc,newLay)
		{
			log.l("Batching all open documents.");
			log.l("Open documents are:");
			for(var x = 0; x < app.documents.length; x++)
			{
				log.l(app.documents[x].name);
			}
			while(app.documents.length>0)
			{

				changeCode(newCode,newDesc,newLay);
				app.activeDocument.close(SaveOptions.SAVECHANGES);
			}
		}


		function justOne(newCode,newDesc,newLay)
		{
			log.l("Just doing the current document.");
			log.l("Current document is: " + app.activeDocument.name);
			changeCode(newCode,newDesc,newLay);
		}

	}




	////////End//////////
	///Logic Container///
	/////////////////////

	/*****************************************************************************/

	///////Begin////////
	////Data Storage////
	////////////////////

	#include "/Volumes/Customization/Library/Scripts/Script Resources/Data/Utilities_Container.js";


	////////End/////////
	////Data Storage////
	////////////////////

	/*****************************************************************************/

	///////Begin////////
	///Function Calls///
	////////////////////

	var errorList = [];
	


	batchPrompt();
	



	////////End/////////
	///Function Calls///
	////////////////////

	/*****************************************************************************/

	
	printLog();

}
container();
