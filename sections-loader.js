class SectionsLoader {
  constructor(containerId, jsonUrl) {
    this.container = document.getElementById(containerId);
    this.jsonUrl = jsonUrl;
  }

  async loadAllSections() {
    try {
      const response = await fetch(this.jsonUrl);
      const data = await response.json();
      this.renderAllSections(data.sections);
    } catch (error) {
      console.error("Ошибка загрузки секций:", error);
      this.container.innerHTML =
        "<p>Ошибка загрузки данных. Пожалуйста, обновите страницу.</p>";
    }
  }

  renderAllSections(sections) {
    const sectionsHTML = sections
      .map((section) => this.generateSectionHTML(section))
      .join("");
    this.container.innerHTML = sectionsHTML;
  }

  generateSectionHTML(section) {
    return `
            <section class="${section.class}">
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
                          .map((download) =>
                            this.generateDownloadHTML(download)
                          )
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
