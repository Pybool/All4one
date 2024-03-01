document.addEventListener("DOMContentLoaded", function () {
  // Function to handle the intersection observer callback
  function handleIntersection(entries, observer) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const currentPageUrl = window.location.href;
        const links = document.querySelectorAll("ul.navigation > li");
        for (let link of links) {
          link.classList.remove("active");
        }
        for (let link of links) {
          if (link.querySelector("a").href === currentPageUrl) {
            link.classList.add("active");
          }

          if (
            currentPageUrl.includes("services-details") &&
            link.querySelector("a").href.includes("/services")
          ) {
            link.classList.add("active");
          }
        }

        // Disconnect the observer once the elements are visible
        observer.disconnect();
      }
    });
  }

  // Create a new Intersection Observer instance
  const observer = new IntersectionObserver(handleIntersection, {
    root: null,
    threshold: 0.1,
  });
  // Observe the target element
  const lastNavigation = document.querySelectorAll("ul.navigation");
  if (lastNavigation?.length > 1) {
    const lastUl = lastNavigation[lastNavigation.length - 1];
    observer.observe(lastUl);
  }

  observer.observe(document.querySelector("ul.navigation"));
});
