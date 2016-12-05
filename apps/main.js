


function checkPassword(){
	if(document.getElementById("pw1t").value != document.getElementById("pw2t").value){
		alert("The passwords do not match.\n" + "Please try again.");
		return false;
	}
	if(!isNaN(document.getElementById("pw1t").value != document.getElementById("pw2t").value)){
		alert("Enter passwords.\n" + "Please try again.");
		return false;
	}
	else{
		alert("Account is created!");
		window.location.href="index4.html";
		return true;
	}
}