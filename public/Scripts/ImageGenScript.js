
  const urlParams = new URLSearchParams(window.location.search);
  const username = urlParams.get('name');
  
  if (username) 
     {
       const welcomeMessage = document.createElement("h1");
       welcomeMessage.textContent = `Welcome, ${username}`;
       document.body.prepend(welcomeMessage);           
      } else {
  
           alert("Unauthorized access. Redirecting to login page...");
           window.location.href = "login.html"; 
       }


  
  async function generateImage() {
    const text = document.getElementById('textInput').value;
    if (!text) {
        alert("Please enter some text!");
        return;
    }

    console.log("Generating image for:", text);
    const loadingMessage = document.getElementById("loadingMessage");
    loadingMessage.classList.remove("hidden");

    try {
        const response = await fetch("http://localhost:9898/user/generate-image", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ prompt: text })
        });

        console.log("Response received:", response);

        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        const imageBlob = await response.blob();
        const reader = new FileReader();

        reader.onloadend = function () {
            const base64data = reader.result;

            console.log("Image generated successfully as base64:", base64data);

            const imgElement = document.getElementById("generatedImage");
            imgElement.src = base64data;

            document.getElementById("imageContainer").classList.remove("hidden");

            const downloadBtn = document.getElementById("downloadBtn");
            downloadBtn.href = base64data;
            downloadBtn.classList.remove("hidden");
            downloadBtn.innerText = "Download Image";

            window.generatedImageDataUrl = base64data; // for sharing
        };

        reader.readAsDataURL(imageBlob);

        // Save search history
        await fetch("http://localhost:9898/user/save-history", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: username,
                prompt: text,
            })
        });

    } catch (error) {
        console.error("Error generating image:", error);
        alert("Failed to generate image: " + error.message);
    } finally {
        loadingMessage.classList.add("hidden");
    }
}





//log out function
document.getElementById("logoutBtn").addEventListener("click",()=>{

  const cleanURL = window.location.origin + window.location.pathname;
  window.history.replaceState({}, document.title, cleanURL);

  window.location.replace("login.html");
});


//Image Share Function
function share(platform) {
  const imageUrl = window.generatedImageDataUrl;

  if (!imageUrl) {
    alert("No image to share!");
    return;
  }

  let shareUrl = "";

  switch (platform) {
    case "whatsapp":
      shareUrl = `https://wa.me/?text=${encodeURIComponent("Check out this AI-generated image!")}`;
      window.open(shareUrl, "_blank");
      break;

    case "facebook":
      alert("Facebook cannot share image directly from base64. Please upload it to a server first.");
      break;

    case "gmail":
      const subject = "Check out this AI Image!";
      const body = `Hey,\n\nLook at this AI-generated image I made (see attachment or image):\n\n${imageUrl}`;
      shareUrl = `https://mail.google.com/mail/?view=cm&fs=1&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.open(shareUrl, "_blank");
      break;

    case "copy":
      navigator.clipboard.writeText(imageUrl)
        .then(() => alert("Image URL copied to clipboard!"))
        .catch(err => alert("Failed to copy URL."));
      break;
  }
}







document.getElementById("historyDropdownBtn").addEventListener("click", () => {
  document.getElementById("historyList").classList.toggle("hidden");
});

async function loadSearchHistory() {
  const urlParams = new URLSearchParams(window.location.search);
  const username = urlParams.get('name');

  if (!username) return;

  try {
    const response = await fetch(`http://localhost:9898/user/get-history`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name: username })
    });

    const history = await response.json();
    console.log(history);

    const historyList = document.getElementById("historyList");
    historyList.innerHTML = "";

    if (!Array.isArray(history)) {
      console.error("History is not an array:", history);
      return;
    }

    history.forEach(entry => {
      const li = document.createElement("li");
      li.textContent = `${entry.prompt} (${new Date(entry.timestamp).toLocaleString()})`;
      li.addEventListener("click", () => {
        document.getElementById("textInput").value = entry.prompt;
        document.getElementById("historyList").classList.add("hidden");
      });
      historyList.appendChild(li);
    });

  } catch (error) {
    console.error("Error loading history:", error);
  }
}


// Load history when page loads
window.addEventListener("DOMContentLoaded", loadSearchHistory);
