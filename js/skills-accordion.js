// Skills Accordion Functionality
document.addEventListener('DOMContentLoaded', function() {
    initSkillsAccordion();
});

function initSkillsAccordion() {
    const accordionItems = document.querySelectorAll('.accordion-item');
    
    // Set first accordion item as active by default
    if (accordionItems.length > 0) {
        accordionItems[0].classList.add('active');
    }
    
    // Add click event listeners to accordion headers
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        
        header.addEventListener('click', () => {
            // Close all accordion items
            accordionItems.forEach(accItem => {
                if (accItem !== item) {
                    accItem.classList.remove('active');
                }
            });
            
            // Toggle current accordion item
            item.classList.toggle('active');
            
            // Initialize skill bars for visible skills
            if (item.classList.contains('active')) {
                const skillBars = item.querySelectorAll('.skill-progress');
                skillBars.forEach(bar => {
                    const skill = bar.closest('.skill-item');
                    const level = skill.getAttribute('data-level');
                    setTimeout(() => {
                        bar.style.width = `${level}%`;
                    }, 100);
                });
            }
        });
    });
    
    // Initialize skill bars for initially active accordion
    const activeAccordion = document.querySelector('.accordion-item.active');
    if (activeAccordion) {
        const skillBars = activeAccordion.querySelectorAll('.skill-progress');
        skillBars.forEach(bar => {
            const skill = bar.closest('.skill-item');
            const level = skill.getAttribute('data-level');
            setTimeout(() => {
                bar.style.width = `${level}%`;
            }, 100);
        });
    }
}
