import { ReactElement } from "react";
import { Calendar, Clock, BookOpen } from "lucide-react";
import "../css/ThisWeeksActivities.css";

export const ThisWeeksActivities = (): ReactElement => {
  /* Hårdkodade värden */
  const activities = [
    {
      id: "1",
      type: "Föreläsning",
      tagClass: "lecture",
      title: "Introduktion till React",
      date: "2023-09-04",
      time: "09:00-12:00",
    },
    {
      id: "2",
      type: "Övning",
      tagClass: "exercise",
      title: "React komponenter",
      date: "2023-09-05",
      time: "09:00-12:00",
    },
    {
      id: "3",
      type: "E-learning",
      tagClass: "elearning",
      title: "React Hooks",
      date: "2023-09-06",
      time: "09:00-12:00",
    },
    {
      id: "4",
      type: "Inlämning",
      tagClass: "submission",
      title: "React applikation",
      date: "2023-09-08",
      time: "23:59",
    },
  ];

  return (
    <section className="twa-section-container">
      {/* Header */}
      <div className="twa-header-container">
        <h2 className="twa-header-title">Veckans aktiviteter</h2>
        <div className="twa-week-badge">
          <Calendar size={16} />
          <span>Vecka 36</span>
        </div>
      </div>

      {/* Module */}
      <div className="twa-module-container">
        <div className="twa-module-header">
          <BookOpen size={16} color="#1e40af" />
          <h4 className="twa-module-name">Modul: Javascript</h4>
        </div>

        {/* Activities */}
        {activities.map((a) => (
          <div key={a.id} className="twa-activity-container">
            <div className="twa-activity-top">
              <div className="twa-tag">{a.type}</div>
              <h3 className="twa-activity-title">{a.title}</h3>
            </div>

            <div className="twa-activity-bottom">
              <span className="twa-datetime">
                <Calendar size={16} /> {a.date}
              </span>
              <span className="twa-datetime">
                <Clock size={16} /> {a.time}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
