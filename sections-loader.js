class SectionsLoader {
  constructor(containerId, jsonUrl) {
    this.container = document.getElementById(containerId);
    this.jsonUrl = jsonUrl;
  }

  async loadAllSections() {
    try {
      const response = await fetch(this.jsonUrl);
      const data = await response.json();
      this.renderHeaderMenu(data.sections); // Добавляем генерацию меню
      this.renderAllSections(data.sections);
    } catch (error) {
      console.error("Ошибка загрузки секций:", error);
      this.container.innerHTML =
        "<p>Ошибка загрузки данных. Пожалуйста, обновите страницу.</p>";
    }
  }

  // Новый метод для генерации меню
  renderHeaderMenu(sections) {
    const headerMenu = document.querySelector(".header_menu");

    const menuItemsHTML = sections
      .map(
        (section) => `
      <li>
        <a href="#${section.id}">${section.name}</a>
      </li>
    `
      )
      .join("");

    // Добавляем пункты меню после "Главная"
    headerMenu.innerHTML += menuItemsHTML;

    // Добавляем обработчики событий для плавной прокрутки
    this.addSmoothScroll();
  }

  // Метод для плавной прокрутки
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
}
