class SectionsLoader {
  constructor(containerId, jsonUrl) {
    this.container = document.getElementById(containerId);
    this.jsonUrl = jsonUrl;
    this.isMenuOpen = false;
  }

  async loadAllSections() {
    try {
      const response = await fetch(this.jsonUrl);
      const data = await response.json();
      this.renderHeaderMenu(data.sections);
      this.renderAllSections(data.sections);
      this.initMenuToggle();
      this.initScrollToTop();
    } catch (error) {
      console.error("Ошибка загрузки секций:", error);
      this.container.innerHTML =
        "<p>Ошибка загрузки данных. Пожалуйста, обновите страницу.</p>";
    }
  }

  initMenuToggle() {
    const headerContainer = document.querySelector(".header_container");
    const headerMenu = document.querySelector(".header_menu");
    const overlay = document.getElementById("overlay");
    const menuText = document.querySelector(".menu");

    const toggleMenu = () => {
      this.isMenuOpen = !this.isMenuOpen;

      if (this.isMenuOpen) {
        headerMenu.classList.add("active");
        overlay.classList.add("active");
        document.body.classList.add("locked");
        menuText.textContent = "ЗАКРЫТЬ";
        headerContainer.classList.add("active");

        setTimeout(() => {
          headerMenu.focus();
        }, 100);
      } else {
        headerMenu.classList.remove("active");
        overlay.classList.remove("active");
        document.body.classList.remove("locked");
        menuText.textContent = "МЕНЮ";
        headerContainer.classList.remove("active");
      }
    };

    headerContainer.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleMenu();
    });

    overlay.addEventListener("click", () => {
      if (this.isMenuOpen) {
        toggleMenu();
      }
    });

    headerMenu.addEventListener("click", (e) => {
      if (e.target.tagName === "A") {
        setTimeout(() => {
          toggleMenu();
        }, 300);
      }
    });

    document.addEventListener("click", (e) => {
      if (
        this.isMenuOpen &&
        !headerContainer.contains(e.target) &&
        !headerMenu.contains(e.target)
      ) {
        toggleMenu();
      }
    });

    document.addEventListener("keydown", (e) => {
      if (this.isMenuOpen && e.key === "Escape") {
        toggleMenu();
      }
    });

    headerMenu.addEventListener("click", (e) => {
      e.stopPropagation();
    });
  }

  renderHeaderMenu(sections) {
    const headerMenu = document.querySelector(".header_menu");

    const menuItemsHTML = sections
      .map(
        (section) => `
      <li>
        <a href="#${section.id}" title="${section.name}">${section.name}</a>
      </li>
    `
      )
      .join("");

    headerMenu.innerHTML = menuItemsHTML;

    this.addSmoothScroll();
  }

  addSmoothScroll() {
    const links = document.querySelectorAll('.header_menu a[href^="#"]');

    links.forEach((link) => {
      link.addEventListener("click", function (e) {
        e.preventDefault();

        const targetId = this.getAttribute("href");
        if (targetId === "#") return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      });
    });
  }

  renderAllSections(sections) {
    const sectionsHTML = sections
      .map((section) => this.generateSectionHTML(section))
      .join("");
    this.container.innerHTML = sectionsHTML;
  }

  generateSectionHTML(section) {
    return `
      <section id="${section.id}" class="${section.class}">
        <div class="group_name"><h2>${section.name}</h2></div>
        ${section.apps.map((app) => this.generateAppHTML(app)).join("")}
      </section>
    `;
  }

  generateAppHTML(app) {
    return `
      <div class="app glassmorphism">
        <img class="app_image" src="${app.image}" alt="${app.name}" />
        <div class="title_description">
          <h3 class="title">${app.name}</h3>
          <h4 class="description">${app.description}</h4>
          <div class="icons_download">
            ${app.downloads
              .map((download) => this.generateDownloadHTML(download))
              .join("")}
          </div>
        </div>
      </div>
    `;
  }

  generateDownloadHTML(download) {
    return `
      <a class="link_download" href="${download.url}" target="_blank">
        <img class="image_download" width="30" height="30" src="${download.icon}" alt="${download.type}" />
      </a>
    `;
  }

  initScrollToTop() {
    const scrollButton = document.getElementById("scrollToTop");

    window.addEventListener("scroll", () => {
      if (window.pageYOffset > 300) {
        scrollButton.classList.add("active");
      } else {
        scrollButton.classList.remove("active");
      }
    });

    scrollButton.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }
}
