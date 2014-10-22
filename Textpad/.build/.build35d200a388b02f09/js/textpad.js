
//---OpenFile()-----------------------------------------
var filename;
var opnFile = function() {
	console.log("OpenFile():: entered");
	newtext = false;
	$("#file_list").children("li").on("tap",function(){
		filename = $(this).attr('data-name');
	});
	console.log("Opened file name : "+filename);
	tizen.filesystem.resolve('documents', function(dir) {
		documentsDir = dir;
		dir.listFiles(onsuccess, onerror);
		//console.log("Mount point Name is " +  dir.path);
	}, function(e) {
		console.log("Error" + e.message);
	}, "rw");
}


//---------------------------------------

$(document).bind( 'pageinit', opnFile );


//---onsuccess()-----------------------------------

var myListID;
function onsuccess(files) {
	$("#file_list").empty();
	var content;
	for ( var i = 0; i < files.length; i++) {

		content = "<li id = '" + files[i].name + "' >" + files[i].name
				+ "</li>";

		console.log(files.length);

		$("#file_list").append(content).listview('refresh');

		$("[id = '" + files[i].name + "']").click(function(event) {
			event.stopPropagation();
			myListID = $(this).attr("id");

			tizen.filesystem.resolve('documents', function(dir) {
				dir.listFiles(myonSuccess, onerror);

			}, function(e) {
				console.log("Error" + e.message);
			}, "rw");

		});

	}

}

//---myonSuccess()-------------------------------------------------------

function myonSuccess(files) {
    //alert(myListID);
    for(var i = 0; i < files.length; i++) {
    	if(files[i].name==myListID){
		    if (files[i].isDirectory == false)
		        files[i].readAsText(
		            function(str){
		            	myFileContent(str);
		              console.log("The file content " + str);
		            }, function(e){
		              console.log("Error " + e.message);
		            }, "UTF-8"
		    );
    	}
    }
    
}

//--- myFileContent() --------------------------------------------

function myFileContent(strn){
	console.log("myFileContent():: entered");
	$.mobile.changePage('#meditor');
	var newstr=document.getElementById("myTextEditor").value; 
	var n=newstr.replace(strn).replace(/version=3/g,"version=2");
	document.getElementById("myTextEditor").value=strn;
	
}

//--- CreateNew() --------------------------------------------------

function CreateNew(){
	console.log("createNew():: entered");
	newtext = true;
	$("#myTextEditor").val("");
	var deviceheight = $(window).height();
	//console.log("height"+deviceheight);
	deviceheight=deviceheight-150;
	console.log("height"+deviceheight);
	deviceheight=deviceheight+"px";
	//document.getElementById("myTextEditor").style.height = deviceheight;
	$("#myTextEditor").css('height',deviceheight);
	
}

//--- savetext() ------------------------


var documentsDir;
tizen.filesystem.resolve(
		'documents',
	     function(dir){
    documentsDir = dir; 
  }, function(e) {
    console.log("Error" + e.message);
  }, "rw");

function SaveText() {
	console.log("SaveText::Entered");
	var x = document.getElementById("myTextEditor").value;
	console.log("Text: " + x);
	var filename= $("#textFileName").val();
	console.log("filename : "+ filename);
	//file = dir.resolve("helloWorld.doc");
	var testFile;
	testFile = documentsDir.resolve("Hell0.txt");
	if (testFile != null) {
		console.log("testFile is not Null");
		//testFile = documentsDir.resolve("Hell0.txt");
		testFile.openStream("w", function(fs) {
			//y++;
			fs.write(x);
			fs.close();
		}, function(e) {
			console.log("Error " + e.message);
		}, "UTF-8");
	} else {
		console.log("testFile is Null");
		testFile = documentsDir.createFile("Hell0.txt");
	}
}