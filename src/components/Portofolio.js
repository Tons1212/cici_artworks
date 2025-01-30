import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

function Portfolio() {
    const { t } = useTranslation();

    const [activeCard, setActiveCard] = useState(null);
    const cardRefs = useRef([]); 

    const handleCardClick = (index) => {
        setActiveCard(prevIndex => (prevIndex === index ? null : index));
    };

    const handleClickOutside = (event) => {
        
        if (activeCard !== null && cardRefs.current[activeCard] && !cardRefs.current[activeCard].contains(event.target)) {
            setActiveCard(null); 
        }
    };

    useEffect(() => {
        if (activeCard !== null) {
            
            document.addEventListener('click', handleClickOutside);
        } else {
            
            document.removeEventListener('click', handleClickOutside);
        }

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeCard]);

    const projects = t('portfolio.projects', { returnObjects: true });

    return (
        <div id='portfolio' className='portfolio'>
            <h2>{t('portfolio.title')}</h2>
            <div className='cardContainer'>
                {projects.map((project, index) => (
                    <div
                        key={index}
                        className={`cards ${activeCard === index ? 'active' : ''}`}
                        onClick={() => handleCardClick(index)}
                        ref={(el) => (cardRefs.current[index] = el)}
                    >
                        <div className="card-content">
                            <img src={project.image} alt={project.title} className='project-image' />
                            <h3>{project.title}</h3>
                            <p className='desc'>{project.description}</p>
                            <button className='button' onClick={(e) => { e.stopPropagation(); handleCardClick(index); }}>
                                {t("portfolio.viewMore")}
                            </button>
                            <div className='technologies'>
                            <p>{t("portfolio.tech")}</p>
                                <div className='technology-icon'>{project.technologies.map((tech, techIndex) => (
                                    <img key={techIndex} src={tech} alt={`Technology ${techIndex}`} className='technology-icon' />
                                ))}
                                </div>
                            </div>
                        </div>
                        <div className="card-back">
                            <p>{project.additionalInfo}</p>
                            <p>{project.objectives}</p>
                                <div className='githubLink'>
                                    <p>{t("portfolio.gitlink")}</p>
                                <a href= {project.link} className='github-link' target='_blank' rel="noopener noreferrer">{t("portfolio.code")}</a>
                                </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Portfolio;