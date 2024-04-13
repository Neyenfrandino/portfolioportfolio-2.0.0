const useEffect = () => {
    const grids = document.querySelectorAll('.container-grid-project, .container-skills-contacts');

    function isElementInViewport(el) {
        for (let i of el) {
            const rect = i.getBoundingClientRect();
            const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
            const threshold = i.offsetHeight / 1.5; // 50% of the element's height

            if (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom - threshold <= viewportHeight &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            ) {
                return true;
            }
        }

        return false;
    }

    function callbackFunc() {
        grids.forEach((grid) => {
            if (isElementInViewport([grid])) {
                grid.classList.add("in-view");
            } else {
                grid.classList.remove("in-view");
            }
        });
    }

    window.addEventListener("load", callbackFunc);
    window.addEventListener("resize", callbackFunc);
    window.addEventListener("scroll", callbackFunc);
};

useEffect();

const effectImageAvatar = () => {
    const presentationImg = document.querySelector('.presentation-img');
    const img = document.createElement('img');
    img.src = "../img/OIG3.jpeg";
    img.alt = 'avatarProfile';
  
    presentationImg.appendChild(img);
  
    presentationImg.addEventListener('mouseenter', () => {
      img.style.transition = 'transform 0.4s'; // Agrega una transición para suavizar la animación
      img.style.transform = 'rotateY(90deg)'; // Rota horizontalmente 90 grados
      setTimeout(() => {
        img.src = '../img/Imagen de WhatsApp 2024-01-09 a las 19.18.52_46fe2161.jpg';
        img.style.transform = 'rotateY(0deg)'; // Vuelve a la posición original
      }, 300); // Cambia la imagen y vuelve a la posición original después de 300 milisegundos (0.3 segundos)
    });
  
    presentationImg.addEventListener('mouseleave', () => {
      img.style.transition = 'transform 0.4s'; // Agrega una transición para suavizar la animación
      img.style.transform = 'rotateY(-90deg)'; // Rota horizontalmente -90 grados (en sentido opuesto)
      setTimeout(() => {
        img.src = '/img/OIG3.jpeg';
        img.style.transform = 'rotateY(0deg)'; // Vuelve a la posición original
      }, 300); // Cambia la imagen y vuelve a la posición original después de 300 milisegundos (0.3 segundos)
    });
}
    
effectImageAvatar();

const addImageGrid = async () => {
    const gridItems = document.querySelectorAll('.grid-item');

    try {
        const response = await fetch('../infoJobs.json');
        const info = await response.json();

        gridItems.forEach((element, index) => {
            const imgGrid = document.createElement('img');
            imgGrid.className = 'imgGrid'
            imgGrid.src = info[index].url;
            imgGrid.alt = `Image ${index + 1}`;

            element.appendChild(imgGrid);
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

addImageGrid();


const addSkills = async () => {
    const skillsContainer = document.querySelector('.skills')

    try {
        const response = await fetch('../skills.json');
        const info = await response.json();

        const { skills } = info

        skills.forEach((element, index) =>{
            const imgContainer = document.createElement('div')
            imgContainer.className =  'imgContainer'

            if(element.name == 'FastAPI'){
                const img = document.createElement('img');
                img.src = element.icono;
                img.alt = element.nombre;
                img.classList.add('skills-fastApi')
                imgContainer.appendChild(img)

            } else {
                const img = document.createElement('img');
                img.src = element.icono;
                img.alt = element.nombre; 
                imgContainer.appendChild(img)
            }

            skillsContainer.appendChild(imgContainer);
           
            animatedSkills(imgContainer, skillsContainer )
        
            tooltip(imgContainer, element)
        })
      
    } catch (error) {
        console.error('Error:', error);
    }
}

addSkills();

const animatedSkills = (imgContainer, skillsContainer) => {
    let animation = false
    let isBouncing = false;
    let clickCount = 0;
    imgContainer.addEventListener('click', () => {
        clickCount++;

        if (!isBouncing) {
            isBouncing = true;
            imgContainer.classList.add('bounce');
                imgContainer.addEventListener('animationend', () => {
                imgContainer.classList.remove('bounce');
                isBouncing = false;
            }, { once: true });
        }
        
        if( clickCount == 10){
            animation = true
            clickCount = 0
            skillsContainer.classList.add('playAnimations');
            
        }
        countQuantityClicks(clickCount, imgContainer, animation)

        setTimeout(() => {
            skillsContainer.classList.remove('playAnimations')
            animation = false
        }, 15000);
        return clickCount
    });
    
    
}

const tooltip = (imgContainer, element) => {
    let tooltipCreated = false;
    let timer; 
    imgContainer.addEventListener('dblclick', (event) => {
        if (!tooltipCreated) {
            const tooltip = document.createElement('div');
            tooltip.classList.add('tooltip');
            tooltip.textContent = 'More details skills   ';
    
            const icon = document.createElement('i')
            icon.classList.add("fas", "fa-expand");
    
            const buttonExpand = document.createElement('button')
            buttonExpand.className = 'button-expand'
            buttonExpand.title = 'Expand'
            buttonExpand.appendChild(icon)

            buttonModal(buttonExpand, element, tooltip)
            tooltip.appendChild(buttonExpand)
    
            // Posiciona el tooltip al lado del cursor del mouse
            tooltip.style.top = `${event.clientY + 50}px`;
            tooltip.style.left = `${event.clientX + 50}px`;
    
            document.body.appendChild(tooltip);
            tooltipCreated = true;
    
            timer = setTimeout(() => {
                document.body.removeChild(tooltip);
                tooltipCreated = false;
            }, 2000); // Elimina el tooltip después de 2 segundos
    
            // Detiene el temporizador cuando el mouse entra al tooltip
            tooltip.addEventListener('mouseenter', () => {
                clearTimeout(timer);
            });
    
            // Reanuda el temporizador cuando el mouse sale del tooltip
            tooltip.addEventListener('mouseleave', () => {
                timer = setTimeout(() => {
                    document.body.removeChild(tooltip);
                    tooltipCreated = false;
                }, 2000);
            });
        }
    });
}

const buttonModal = (button, element, tooltip) => {
    
    const containerModal = document.querySelector('.container--modal');
    const overlay = document.createElement('div');
    overlay.classList.add('overlay');

    containerModal.innerHTML = ''
    button.addEventListener('click', () => {
        tooltip.style.display = 'none'
        
        overlay.style.display = 'block';     
        containerModal.style.display = 'grid';
        
        const {name, icono, image, courseContext} = element

        const contextElementContainer = document.createElement('div')

        contextElementContainer.classList.add('context-element-container')
        
        const imgElementContainer = document.createElement('div')
        imgElementContainer.classList.add('img-element-container')
        
        const footerElement = document.createElement('footer')
        footerElement.classList.add('footer-element')
        
        const spanElement = document.createElement('span')
        spanElement.classList.add('course-context')
        
        const img = document.createElement('img')
        img.classList.add('image')
        
        const footerElementContainer = document.createElement('div')
        footerElementContainer.classList.add('footer-content')

        const containerIcons = document.createElement('div')
        
        const footerIconLinkeding = document.createElement('i')
        const ancorLinkedin = document.createElement('a')
        ancorLinkedin.target = '_blank';

        ancorLinkedin.href = 'https://www.linkedin.com/in/neyen-frandino/'
        footerIconLinkeding.className = 'footerIconLinkeding'
        footerIconLinkeding.classList.add('fab', 'fa-linkedin')
        
        const footerIconGitHub = document.createElement('i')
        const ancorGitHub = document.createElement('a')
        ancorGitHub.target = '_blank';

        ancorGitHub.href = 'https://github.com/Neyenfrandino'
        footerIconGitHub.className = 'footerIconGitHub'
        footerIconGitHub.classList.add('fab', 'fa-github')
        
        const footerspan = document.createElement('span')
        footerspan.className = 'footerspan'
        
        
        const iconFooterSkillContainer = document.createElement('div')
        iconFooterSkillContainer.classList.add('icon-footer-skill-container')

        const iconFooterSkill = document.createElement('img')
        iconFooterSkill.classList.add('icon-footer-skill')
        

        
        ancorGitHub.appendChild(footerIconGitHub)
        ancorLinkedin.appendChild(footerIconLinkeding)

        containerIcons.appendChild(ancorGitHub)
        containerIcons.appendChild(ancorLinkedin)

       
        footerElementContainer.appendChild(footerspan)
        footerElementContainer.appendChild(containerIcons)
       

        iconFooterSkillContainer.appendChild(iconFooterSkill)

        if(name == 'FastAPI'){
            spanElement.innerText = courseContext
            img.src = image


            iconFooterSkill.src = icono
            iconFooterSkill.className = 'skills-fastApi'
        
        }

        spanElement.innerText = courseContext
        img.src = image

        footerspan.textContent = 'You can see the repository on git hub or see my profile on linkeding...'
        iconFooterSkill.src = icono

        contextElementContainer.appendChild(spanElement)
        imgElementContainer.appendChild(img)
        footerElement.appendChild(footerElementContainer)
        footerElement.appendChild(iconFooterSkillContainer)

        containerModal.appendChild(contextElementContainer)
        containerModal.appendChild(imgElementContainer)
        containerModal.appendChild(footerElement)

    });
    
    document.body.appendChild(overlay);

    overlay.addEventListener('click', () => {
        overlay.style.display = 'none'
        containerModal.style.display = 'none'
    })
    
}

const countQuantityClicks = (quantityClicks, imgContainer, animation) => {
    if(animation){
        const allNoteClick = document.querySelectorAll('.containerCountClick')
        allNoteClick.forEach(i => {
            i.remove()
            
        })
    } else {
        const existingCount = imgContainer.querySelector('.containerCountClick');
        if (existingCount) {
            imgContainer.removeChild(existingCount);  
        }
        const containerCountClick = document.createElement('div')
        containerCountClick.className = 'containerCountClick'
        containerCountClick.textContent = quantityClicks;
        imgContainer.appendChild(containerCountClick);
    }
}

