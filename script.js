const searchBtn = document.getElementById("search-btn");
const searchInput = document.getElementById("search-input");
const allBtn = document.getElementById("all-btn");
const categoryBtns = document.getElementById("category-btns");
const sortBtn = document.getElementById("sort-btn");

window.onload = async () => {
  try {
    const res = await fetch(
      "https://openapi.programming-hero.com/api/phero-tube/videos"
    );
    const data = await res.json();

    if (data && data.videos.length > 0) {
      displayVideos(data.videos);
    } else {
      throw new Error("Something went wrong");
    }
  } catch (error) {
    console.error(error);
  }
};

searchBtn.addEventListener("click", async () => {
  try {
    const res = await fetch(
      `https://openapi.programming-hero.com/api/phero-tube/videos?title=${searchInput.value}`
    );
    const data = await res.json();
    //console.log(data);
    if (data && data.videos.length > 0) {
      displayVideos(data.videos);
    } else {
      throw new Error("Something went wrong");
    }
  } catch (error) {
    console.error(error);
  }
});

sortBtn.addEventListener("click", async () => {
  bgRedBtn(allBtn);
  try {
    const res = await fetch(
      "https://openapi.programming-hero.com/api/phero-tube/videos"
    );
    const data = await res.json();
    // console.log(parseFloat(data.videos[0].others?.views) * 1000);

    const sortedData = data.videos.sort((a, b) => {
      //log(a.others?.views, b.others?.views);
      return (
        parseFloat(b.others?.views) * 1000 - parseFloat(a.others?.views) * 1000
      );
    });

    if (data && data.videos.length > 0) {
      displayVideos(sortedData);
      //console.log(sortedData);
    } else {
      throw new Error("Something went wrong");
    }
  } catch (error) {
    console.error(error);
  }
});

allBtn.addEventListener("click", async () => {
  //allBtn.classList = "bg-red-500 py-1 px-4 rounded";
  bgRedBtn(allBtn);
  try {
    const res = await fetch(
      "https://openapi.programming-hero.com/api/phero-tube/videos"
    );
    const data = await res.json();

    if (data && data.videos.length > 0) {
      displayVideos(data.videos);
    } else {
      throw new Error("Something went wrong");
    }
  } catch (error) {
    console.error(error);
  }
});

function getTime(time) {
  const year = parseInt(time / 31536000);
  const month = parseInt((time % 31536000) / 2592000);
  const day = parseInt((time % 2592000) / 86400);
  const hours = parseInt((time % 86400) / 3600);
  const minutes = parseInt((time % 3600) / 60);
  const seconds = parseInt((time % 3600) % 60);

  if (year > 1) {
    return `${year}Y ${month}M ${day}D ${hours}h ${minutes}m`;
  }
  if (month > 1) {
    return `${month}M ${day}D ${hours}h ${minutes}m`;
  }
  if (day > 1) {
    return `${day}D ${hours}h ${minutes}m`;
  }
  if (hours > 1) {
    return `${hours}h ${minutes}m`;
  }
  if (minutes > 1) {
    return `${minutes}m`;
  }
  return `${seconds}s`;
}

function displayVideos(videos) {
  const videoContainer = document.getElementById("videos-container");

  videoContainer.innerHTML = "";

  videos.forEach((video) => {
    //console.log(video.title);
    const div = document.createElement("div");
    div.classList = "card card-compact";
    div.innerHTML = `
      <figure class="h-[300px] rounded-xl relative">
      <img
      class="w-full h-full object-cover "
        src= ${video.thumbnail}
        alt="Shoes" />
       ${
         video.others.posted_date.length > 0
           ? `
       <p class="absolute bg-gray-800 bottom-2 right-2 text-white p-2 rounded-md"> ${getTime(
         video.others?.posted_date
       )} ago </p> 
       `
           : ""
       }
    </figure>
    <div class="px-0 py-2 flex gap-2">
    <img class="w-10 h-10 rounded-full object-cover" src=${
      video.authors[0].profile_picture
    }/>
      <div>
      <h2 class="card-title font-bold">${video.title}</h2>
      <p class="font-semibold text-gray-500">${
        video.authors[0].profile_name
      } <span> ${video.authors[0].verified ? "✅" : ""} </span> </p>
      <p class="text-gray-500">${video.others.views} views</p>
      </div>
      
    </div>
          `;

    videoContainer.appendChild(div);
  });
}

function noVideoFound() {
  const videoContainer = document.getElementById("videos-container");
  videoContainer.innerHTML = "";
  const div = document.createElement("div");
  div.classList =
    "text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2";
  div.innerHTML = `
              <div class="w-[500px] mx-auto flex items-center justify-center flex-col">
              <img src="./assets/Icon.png" alt="icon" />
              <h1 class="text-3xl font-bold">Oops!! Sorry, No videos found</h1>
              </div>
              `;
  videoContainer.appendChild(div);
}

function bgRedBtn(clickedBtn) {
  const allButtons = document.querySelectorAll("#category-btns button");
  //console.log(allButtons);

  allButtons.forEach((btn) => {
    btn.classList = "bg-gray-400 py-1 px-4 rounded";
  });
  clickedBtn.classList = "bg-red-500 py-1 px-4 rounded";
}

async function addBtns() {
  try {
    const res = await fetch(
      " https://openapi.programming-hero.com/api/phero-tube/categories"
    );
    const data = await res.json();
    //console.log(data);

    if (data && data.categories) {
      data.categories.forEach((ele) => {
        let btn = document.createElement("button");
        btn.classList = "bg-gray-400 py-1 px-4 rounded";
        btn.innerText = ele.category;
        categoryBtns.appendChild(btn);

        btn.addEventListener("click", async () => {
          allBtn.classList = "bg-gray-400 py-1 px-4 rounded";
          //console.log(data.categories, ele.category_id);
          bgRedBtn(btn);

          // btn.classList = "bg-red-500 py-1 px-4 rounded";
          try {
            const res = await fetch(
              `https://openapi.programming-hero.com/api/phero-tube/category/${ele.category_id}`
            );
            const data = await res.json();
            if (data && data.category.length > 0) {
              displayVideos(data.category);
              //console.log(data.category);
            } else {
              noVideoFound();
            }
          } catch (error) {
            console.error(error);
          }
        });
      });
    } else {
      throw new Error("Something went wrong");
    }
  } catch (error) {
    console.error(error);
  }
}

addBtns();
