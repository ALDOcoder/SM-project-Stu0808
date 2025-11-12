/*---------- Faqs Accordion ----------*/

document.querySelectorAll('.faq .accordion-container .accordion').forEach(faqAccordion =>{
    faqAccordion.onclick = () =>{
        faqAccordion.classList.toggle('active');
    }
});