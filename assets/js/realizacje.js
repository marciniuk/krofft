(() => {
  const createProject = (project) => ({
    ...project,
    cover: "1.webp",
    images: Array.from(
      { length: project.imageCount },
      (_, index) => String(index + 1) + ".webp",
    ),
  });

  const projects = [
    createProject({
      slug: "apartament-chwarzno-gdynia",
      title: "Apartament Chwarzno",
      location: "GDYNIA",
      category: "apartamenty",
      categoryLabel: "Apartamenty i rezydencje",
      description:
        "Zabudowy meblowe wykonane na wymiar do apartamentu w Gdyni Chwarznie.",
      scope: "Kuchnia, hol i łazienka.",
      imageCount: 3,
    }),
    createProject({
      slug: "apartament-grobla-gdansk",
      title: "Apartament Grobla",
      location: "GDAŃSK",
      category: "apartamenty",
      categoryLabel: "Apartamenty i rezydencje",
      description:
        "Realizacja mebli na wymiar do apartamentu przy ulicy Grobla.",
      scope: "Zabudowy i wyposażenie wnętrza.",
      imageCount: 8,
    }),
    createProject({
      slug: "apartament-letnica-gdansk",
      title: "Apartament Letnica",
      location: "GDAŃSK",
      category: "apartamenty",
      categoryLabel: "Apartamenty i rezydencje",
      description: "Meble na wymiar do apartamentu w gdańskiej Letnicy.",
      scope: "Zabudowy i wyposażenie apartamentu.",
      imageCount: 10,
    }),
    createProject({
      slug: "apartament-przymorze-gdansk",
      title: "Apartament Przymorze",
      location: "GDAŃSK",
      category: "apartamenty",
      categoryLabel: "Apartamenty i rezydencje",
      description:
        "Indywidualne wyposażenie mieszkania dopasowane do potrzeb domowników.",
      scope: "Kuchnia, garderoba, sypialnia i łazienka.",
      imageCount: 6,
    }),
    createProject({
      slug: "apartament-starowiejska",
      title: "Apartament Starowiejska",
      location: "GDAŃSK",
      category: "apartamenty",
      categoryLabel: "Apartamenty i rezydencje",
      description:
        "Zabudowy meblowe na wymiar dopasowane do charakteru apartamentu.",
      scope: "Meble i zabudowy do wnętrza mieszkalnego.",
      imageCount: 12,
    }),
    createProject({
      slug: "apartament-wrzeszcz-gdansk",
      title: "Apartament Wrzeszcz",
      location: "GDAŃSK",
      category: "apartamenty",
      categoryLabel: "Apartamenty i rezydencje",
      description:
        "Meble na wymiar zaprojektowane z myślą o spójnym i funkcjonalnym wnętrzu.",
      scope: "Zabudowy meblowe w apartamencie.",
      imageCount: 9,
    }),
    createProject({
      slug: "garderoba-apartament-gdansk-stare-miasto",
      title: "Garderoba — Stare Miasto",
      location: "GDAŃSK",
      category: "apartamenty",
      categoryLabel: "Apartamenty i rezydencje",
      description:
        "Garderoba i zabudowy wykonane na wymiar w apartamencie na Starym Mieście.",
      scope: "Zabudowy do przechowywania.",
      imageCount: 5,
    }),
    createProject({
      slug: "kuchnia-rezydencja-gdansk",
      title: "Kuchnia w rezydencji",
      location: "GDAŃSK",
      category: "apartamenty",
      categoryLabel: "Apartamenty i rezydencje",
      description: "Kuchnia na wymiar zaprojektowana jako część rezydencji.",
      scope: "Zabudowa kuchenna.",
      imageCount: 4,
    }),
    createProject({
      slug: "rezydencja-bernadowska",
      title: "Rezydencja Bernadowska",
      location: "GDYNIA",
      category: "apartamenty",
      categoryLabel: "Apartamenty i rezydencje",
      description: "Meble na wymiar do rezydencji w Gdyni.",
      scope: "Zabudowy i elementy wyposażenia wnętrza.",
      imageCount: 5,
    }),
    createProject({
      slug: "rezydencja-stolema-gdansk",
      title: "Rezydencja Stolema",
      location: "GDAŃSK",
      category: "apartamenty",
      categoryLabel: "Apartamenty i rezydencje",
      description: "Zabudowy meblowe wykonane na wymiar do rezydencji.",
      scope: "Meble i zabudowy w przestrzeni mieszkalnej.",
      imageCount: 8,
    }),
    createProject({
      slug: "realizacja-komercyjna-barber-pruszcz-gdanski",
      title: "Salon barberski",
      location: "PRUSZCZ GDAŃSKI",
      category: "komercyjne",
      categoryLabel: "Wnętrza komercyjne",
      description: "Zabudowy i wyposażenie wnętrza salonu barberskiego.",
      scope: "Meble na wymiar do przestrzeni usługowej.",
      imageCount: 7,
    }),
    createProject({
      slug: "drzwi",
      title: "Drzwi i zabudowy",
      location: "GDAŃSK",
      category: "drzwi",
      categoryLabel: "Drzwi i zabudowy",
      description:
        "Drzwi i zabudowy dopasowane do indywidualnego projektu wnętrza.",
      scope: "Drzwi oraz zabudowy na wymiar.",
      imageCount: 2,
    }),
  ];

  const grid = document.getElementById("realizacje-grid");
  const filterButtons = [
    ...document.querySelectorAll(".realizacje-filter-btn"),
  ];
  const searchInput = document.getElementById("realizacje-search");
  const emptyState = document.getElementById("realizacje-empty");
  const dialog = document.getElementById("project-detail-dialog");
  const zoomDialog = document.getElementById("project-image-zoom-dialog");

  if (
    !grid ||
    !filterButtons.length ||
    !searchInput ||
    !emptyState ||
    !dialog ||
    !zoomDialog
  ) {
    return;
  }

  const modalFields = {
    category: document.getElementById("modal-project-category"),
    title: document.getElementById("modal-project-title"),
    location: document.getElementById("modal-project-loc"),
    description: document.getElementById("modal-project-desc"),
    scope: document.getElementById("modal-project-scope"),
    image: document.getElementById("modal-project-img"),
    gallery: document.getElementById("modal-project-gallery"),
  };
  const closeButton = document.getElementById("project-detail-close");
  const zoomButton = document.getElementById("modal-project-image-zoom");
  const zoomCloseButton = document.getElementById("project-image-zoom-close");
  const zoomImage = document.getElementById("project-image-zoom-img");
  const filters = new URLSearchParams(window.location.search);
  const requestedCategory = filters.get("cat");
  let activeCategory = filterButtons.some(
    (button) => button.dataset.filter === requestedCategory,
  )
    ? requestedCategory
    : "all";

  const imageUrl = (project, filename) =>
    encodeURI(`/assets/img/realizacje/${project.slug}/${filename}`);

  const createProjectCard = (project) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className =
      "project-card group relative block w-full overflow-hidden bg-black text-left card-border-glow cursor-pointer transition-all duration-300";
    card.dataset.category = project.category;
    card.dataset.categoryLabel = project.categoryLabel;
    card.dataset.title = project.title;
    card.dataset.location = project.location;
    card.dataset.desc = project.description;
    card.dataset.scope = project.scope;
    card.setAttribute("aria-haspopup", "dialog");
    card.setAttribute("aria-label", `Otwórz galerię: ${project.title}`);

    const imageFrame = document.createElement("span");
    imageFrame.className = "block aspect-[4/3] overflow-hidden zoom-card";

    const image = document.createElement("img");
    image.src = imageUrl(project, project.cover);
    image.alt = project.title;
    image.loading = "lazy";
    image.className =
      "w-full h-full object-cover filter brightness-90 transition-all group-hover:brightness-100";
    imageFrame.append(image);

    const caption = document.createElement("span");
    caption.className =
      "absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-black/95 via-black/60 to-transparent p-5 sm:p-6";

    const text = document.createElement("span");
    text.className = "min-w-0";

    const title = document.createElement("span");
    title.className =
      "block font-serif text-xl sm:text-2xl text-white font-normal transition-colors group-hover:text-brand-gold";
    title.textContent = project.title;

    const location = document.createElement("span");
    location.className =
      "mt-1 block text-[10px] uppercase tracking-[0.25em] text-gray-300 font-sans";
    location.textContent = project.location;
    text.append(title, location);

    const count = document.createElement("span");
    count.className =
      "ml-3 shrink-0 text-[10px] uppercase tracking-wider text-gray-200";
    count.textContent = `${project.images.length} ZDJĘĆ`;

    caption.append(text, count);
    card.append(imageFrame, caption);
    return card;
  };

  const cards = projects.map(createProjectCard);
  grid.replaceChildren(...cards);

  const updateResults = () => {
    const query = searchInput.value.trim().toLocaleLowerCase("pl");
    let visibleCards = 0;

    cards.forEach((card) => {
      const matchesCategory =
        activeCategory === "all" || card.dataset.category === activeCategory;
      const matchesQuery =
        !query ||
        [
          card.dataset.title,
          card.dataset.location,
          card.dataset.categoryLabel,
          card.dataset.desc,
          card.dataset.scope,
        ]
          .filter(Boolean)
          .join(" ")
          .toLocaleLowerCase("pl")
          .includes(query);
      const visible = matchesCategory && matchesQuery;

      card.hidden = !visible;
      if (visible) visibleCards += 1;
    });

    emptyState.classList.toggle("hidden", visibleCards !== 0);
    filterButtons.forEach((button) => {
      const selected = button.dataset.filter === activeCategory;
      button.setAttribute("aria-pressed", String(selected));
      button.classList.toggle("text-black", selected);
      button.classList.toggle("font-semibold", selected);
      button.classList.toggle("border-b-2", selected);
      button.classList.toggle("border-black", selected);
      button.classList.toggle("text-gray-500", !selected);
      button.classList.toggle("font-normal", !selected);
    });
  };

  const openProject = (project) => {
    modalFields.category.textContent = project.categoryLabel;
    modalFields.title.textContent = project.title;
    modalFields.location.textContent = project.location;
    modalFields.description.textContent = project.description;
    modalFields.scope.textContent = project.scope;

    const showImage = (index) => {
      const filename = project.images[index];
      modalFields.image.src = imageUrl(project, filename);
      modalFields.image.alt = `${project.title} — zdjęcie ${index + 1}`;
      modalFields.gallery.querySelectorAll("button").forEach((thumbnail, i) => {
        const selected = i === index;
        thumbnail.setAttribute("aria-pressed", String(selected));
        thumbnail.classList.toggle("border-brand-gold", selected);
        thumbnail.classList.toggle("opacity-60", !selected);
      });
    };

    modalFields.gallery.replaceChildren(
      ...project.images.map((filename, index) => {
        const thumbnail = document.createElement("button");
        thumbnail.type = "button";
        thumbnail.className =
          "aspect-square overflow-hidden border-2 border-transparent transition-opacity hover:opacity-100";
        thumbnail.setAttribute(
          "aria-label",
          `Pokaż zdjęcie ${index + 1}: ${project.title}`,
        );
        thumbnail.setAttribute("aria-pressed", String(index === 0));

        const image = document.createElement("img");
        image.src = imageUrl(project, filename);
        image.alt = "";
        image.loading = "lazy";
        image.className = "h-full w-full object-cover";
        thumbnail.append(image);
        thumbnail.addEventListener("click", () => showImage(index));
        return thumbnail;
      }),
    );

    showImage(0);
    dialog.showModal();
  };

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeCategory = button.dataset.filter;
      updateResults();
    });
  });

  searchInput.addEventListener("input", updateResults);

  cards.forEach((card, index) => {
    card.addEventListener("click", () => openProject(projects[index]));
  });

  closeButton?.addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
  zoomButton?.addEventListener("click", () => {
    zoomImage.src = modalFields.image.src;
    zoomImage.alt = modalFields.image.alt;
    zoomDialog.showModal();
  });
  zoomCloseButton?.addEventListener("click", () => zoomDialog.close());
  zoomDialog.addEventListener("click", (event) => {
    if (event.target === zoomDialog) zoomDialog.close();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && zoomDialog.open) {
      zoomDialog.close();
      return;
    }
    if (event.key === "Escape" && dialog.open) dialog.close();
  });

  updateResults();
})();
