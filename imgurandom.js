// taken from evilinternet(?), original source long gone
// then taken from newroman.net/imgur by TKW905
// and heavily modified by TKW905 as well

imgurcache = new Array();

// Local storage stuff
let boxes = document.getElementsByClassName('box').length;
function save() {
	for (let i = 1; i <= boxes; i++) {
		var checkbox = document.getElementById(String(i));
		localStorage.setItem("checkbox" + String(i), checkbox.checked);	
  	}
	var numImages = document.getElementById("numImages");
	localStorage.setItem("localNumImages", numImages.value);
}

window.addEventListener('change', save);

jQuery(document).ready(function($) {
	// Get locally stored # of images.
	var numImagesOut = JSON.parse(localStorage.getItem("localNumImages"));
	console.log("[LocalStorage] Number of Images Output Value: " + numImagesOut);

	// Set the displayed amount of images in the output.
	if (localStorage.length == null) {
		// Default to 30 if there is no locally stored value.
		document.getElementById("numImagesOut").value = 30;
		document.getElementById("numImages").value = 30;
	} else {
		// Set both the slider and the output label to the stored value.
		document.getElementById("numImagesOut").value = numImagesOut;
		document.getElementById("numImages").value = numImagesOut;
	}

	// Number of images range limiting.
        var numImages = document.getElementById("numImages");
	if (numImages.value > 30) numImages.value = 30;
	else if (numImages.value < 1) numImages.value = 1;

	// This was going to be a thing to be able to reload a previously loaded set of images.
	// Maybe someday I'll finish this.
//      var prevImages = new Array();

	var info_el = $("#info"),
		images_el = $("#images"),
		filteredimages_el = $("#filteredimages");
	
        // Count the number of checkboxes on the page
        var boxes = document.getElementsByClassName('box').length;

	// For each checkbox...
	for (let i = 1; i <= boxes; i++) {
		// If it's stored...
		if (localStorage.length > 0) {
			// Set a variable for the checked status based on the parsing...
			var checked = JSON.parse(localStorage.getItem("checkbox" + String(i)));
			// And finally set the checked status of each box.
			document.getElementById(String(i)).checked = checked;
        	}
	}

	var Imgur = {
		fetch: function(num) {
			var self = this;
			var hideonload = document.getElementsByClassName("hideonload");
			var hideonload2 = document.getElementsByClassName("hideonload-filtered");
			var showFiltered = document.getElementById("1").checked;
			
			// Reset image counters
			self.total = num;
			self.done = 0;
			self.failures = 0;
			
			// Clear images & filtered images sections
			$(images_el).empty();
			$(filteredimages_el).empty();

			// Hide on load for the 2nd "Load Images" button
			for (let i = 0; i < hideonload.length; i++) {
				hideonload[i].style.display = "block";
			}
			
			// Hide on load for the Filtered Images section
			// Ternary-ized to toggle the section on/off based on your selection
			for (let i = 0; i < hideonload2.length; i++) {
				hideonload2[i].style.display = (showFiltered == true) ? "block" : "none";
			}

			for (let i = 0; i < num; i++) {
				self.hunt(function(id) {
					self.done++;
					
					$(images_el).append("<a href=\"https://i.imgur.com/" + id + "_d.webp?maxwidth=4000&fidelity=high\" target=\"_blank\" rel=\"noreferrer\"><img src=\"https://i.imgur.com/" + id + "s.png\" height=\"110\" width=\"110\" /></a>");

					self.update();
				});
			}
		},
		update: function() {
			$(info_el).html(((this.done < this.total) ? "Loading... " + this.done + "/" + this.total + " (" + this.failures + " failures" + ") " : "Done. "));
		},

		hunt: function(cb) {
			// Get checkbox states
                        var showFiltered = document.getElementById("1").checked;
			var tiny = document.getElementById("2").checked;
                        var monopoly = document.getElementById("3").checked;
			var cellphone = document.getElementById("4").checked;
			var facebook = document.getElementById("5").checked;
			var youtube = document.getElementById("6").checked;
			var monster = document.getElementById("7").checked;
			var yugioh = document.getElementById("8").checked;
			var short = document.getElementById("9").checked;
			var charlen = 5;

			// Images
			var self = this,
				id = self.random(charlen),
				img = new Image;

                        // Sub-function: Failed to get a proper image
			function fail() {
                                // Increase failure count
				self.failures++;

				// Display in Filtered Images if option is present
				if (showFiltered == true)
				{
					$(filteredimages_el).append("<a href=\"https://i.imgur.com/" + id + "_d.webp?maxwidth=4000&fidelity=high\" target=\"_blank\" rel=\"noreferrer\"><img src=\"https://i.imgur.com/" + id + "s.png\" height=\"110\" width=\"110\" /></a>");
				}

                                // Update the info for how many images have been loaded
				self.update();

                                // Hunt for a new image
				self.hunt(cb);
			}

			// Alternate fail func for deleted images
			function failnolog() {
				self.failures++;
				self.update();
				self.hunt(cb);
			}

                        // Update the info for how many IMGs have been loaded
			self.update();

                        // Put together the src url for the image we want to check.
			// It's set to a fidelity of low for....some reason.
			// I'm pretty sure the "high" value for fidelity is the max, but I swear I've seen one setting that's above that.
			img.src = "http://i.imgur.com/" + id + "_d.webp?maxwidth=1001&fidelity=low";

                        // Load the image
			img.onload = function() {
				// Time to check the image's height and width
				// Then we can filter out some of the more repetitive images
				// There's quite a few types of images that keep popping up
				if (((img.width == 198) && (img.height == 160)) || ((img.width == 161) && (img.height == 81))) {
					// We're going to assume images of these sizes are an imgur error images.
					// Not going to log these in the filtered images section though.
					failnolog();
				} else if (tiny == true && (img.naturalWidth <= 32) || (img.naturalHeight <= 32)) {
					fail();
				} else if (monopoly == true && ((img.naturalWidth == 298) && (img.naturalHeight == 256))) {
					fail();
				} else if (cellphone == true && (((img.naturalWidth == 652) && (img.naturalHeight == 470)) || ((img.naturalWidth == 225) && (img.naturalHeight == 225)) || ((img.naturalWidth == 399) && (img.naturalHeight == 344)) || ((img.naturalWidth == 760) && (img.naturalHeight == 756)) || ((img.naturalWidth == 500) && (img.naturalHeight == 388)) || ((img.naturalWidth == 90) && (img.naturalHeight == 69)) || ((img.naturalWidth == 449) && (img.naturalHeight == 450)) || ((img.naturalWidth == 540) && (img.naturalHeight == 335)))) {
					fail();
				} else if (facebook == true && ((img.naturalWidth == 128) && (img.naturalHeight == 128))) {
					fail();
				} else if (youtube == true && (((img.naturalWidth == 643) && (img.naturalHeight == 86)) || ((img.naturalWidth == 643) && (img.naturalHeight == 88)) || ((img.naturalWidth == 642) && (img.naturalHeight == 89)) || ((img.naturalWidth == 640) && (img.naturalHeight == 54)) || ((img.naturalWidth == 646) && (img.naturalHeight == 88)) || ((img.naturalWidth == 650) && (img.naturalHeight == 60)))) {
					fail();
				} else if (yugioh == true && ((img.naturalWidth == 760) && (img.naturalHeight == 475))) {
					fail();
				} else if (monster == true && (((img.naturalWidth == 100) && (img.naturalHeight == 75)) || ((img.naturalWidth == 110) && (img.naturalHeight == 128)))) {
					fail();
				} else if (short == true && (img.naturalHeight <= 100)) {
					fail();
				} else {
					cb(id);
				}
			}

			img.onerror = fail;
		},
		random: function(len) {
			// Random Imgur image ID generation. I don't fuck with this since I barely know what I'm looking at.
			var text = new Array();
			var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

			for (let i = 0; i < len; i++) {
				imgurchar = possible.charAt(Math.floor((Math.random() * possible.length)));

				if (-1 == text.indexOf(imgurchar)) {
					text.push(imgurchar);
				} else {
					i--;
				}
			}

			text = text.join("");

			if (-1 == imgurcache.indexOf(text)) {
				imgurcache.push(text);

				return text;
			} else {
				self.random(charlen);

				return false;
			}
		}
	};

	// On-click func call for the Load Images button
	$("#random").on('click', function() {
		Imgur.fetch(numImages.value);
	});
	
	// Hacky on-click func call for the 2nd hidden on-load Load Images button at the bottom of the page.
	$("#random2").on('click', function() {
		Imgur.fetch(numImages.value);
	});
});
