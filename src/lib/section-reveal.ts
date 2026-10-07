export function initSectionReveal() {
  const sections = document.querySelectorAll<HTMLElement>(
    "main > section, main > footer"
  );

  if (!sections.length) return () => {};

  if (
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    sections.forEach((section) => {
      section.classList.add("section-visible");
    });

    return () => {};
  }

  sections.forEach((section, index) => {
    if (index === 0) {
      section.classList.add("section-visible");
    } else {
      section.classList.add("section-reveal");
    }
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("section-visible");
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -8% 0px",
    }
  );

  sections.forEach((section) => observer.observe(section));

  return () => observer.disconnect();
}