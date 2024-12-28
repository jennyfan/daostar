import React, { useState } from "react";
import { Card, Button, Divider } from "@blueprintjs/core";
import './DAOstarResearch.css';

const ResearchCard = ({ title, description, pdfUrl, date, languageOptions, setLanguage }) => {
  return (
    <Card className="research-card">
      <h3 className="card-title">{title}</h3>
      <Divider />
      <div className="card-content">
        <div className="card-description-container">
          <p className="card-description">{description}</p>
          <p className="bp4-text-small">
            <span className="bp4-text-muted">Published: </span>{date}
          </p>
        </div>
      </div>
      <Divider />
      <div className="action-buttons">
        {languageOptions && (
          <div className="button-group">
            {Object.keys(pdfUrl).map((lang) => (
              <Button
                key={lang}
                className={`secondary ${languageOptions.current === lang ? "active" : ""}`}
                onClick={() => setLanguage(lang)}
              >
                {lang}
              </Button>
            ))}
          </div>
        )}
        <Button
          className="primary view-pdf-btn"
          onClick={() => window.open(languageOptions ? pdfUrl[languageOptions.current] : pdfUrl, '_blank')}
        >
          View PDF
        </Button>
      </div>
    </Card>
  );
};

const Research = () => {
  const [taiwanLanguage, setTaiwanLanguage] = useState("Mandarin");

  const researchPapers = [
    {
      title: "The State of DAOs in Singapore",
      description: "An analysis of the DAO ecosystem in Singapore, highlighting regulatory and innovation trends.",
      pdfUrl: "/reports/singapore.pdf",
      date: "Aug 2024",
    },
    {
      title: "The State of DAOs in Taiwan",
      description: "An in-depth analysis of the DAO landscape in Taiwan, focusing on local governance.",
      pdfUrl: {
        Mandarin: "/reports/taiwan_mandarin.pdf",
        English: "/reports/taiwan_english.pdf",
      },
      date: "Nov 2024",
    },
    {
      title: "The State of DAOs in Korea",
      description: "A comprehensive report on the development and challenges of DAOs in Korea.",
      pdfUrl: "/reports/korea.pdf",
      date: "Oct 2024",
    },
    {
      title: "The State of DAOs in Japan",
      description: "Exploring the unique aspects of DAOs in Japan, including cultural and regulatory impacts.",
      pdfUrl: "/reports/japan.pdf",
      date: "April 2024",
    },
    {
      title: "The DAO Policy Trilemma",
      description: "An exploration of the policy challenges faced by DAOs, proposing potential solutions.",
      pdfUrl: "/reports/trilemma.pdf",
      date: "April 2024",
    },
    {
      title: "The State of DAO Security",
      description: "An analysis of DAO security vulnerabilities and introducing a security standard.",
      pdfUrl: "/reports/security.pdf",
      date: "Dec 2024",
    },
  ];

  return (
    <div className="explore-page">
      <h1>Research Reports</h1>
      <p>Explore our latest research and insights on DAOs and decentralized governance.</p>
      <div className="research-card-outlay">
        {researchPapers.map((paper, index) => (
          <ResearchCard
            key={index}
            title={paper.title}
            description={paper.description}
            pdfUrl={paper.pdfUrl}
            date={paper.date}
            languageOptions={paper.pdfUrl.Mandarin ? { current: taiwanLanguage } : null}
            setLanguage={setTaiwanLanguage}
          />
        ))}
      </div>
    </div>
  );
};

export default Research;
