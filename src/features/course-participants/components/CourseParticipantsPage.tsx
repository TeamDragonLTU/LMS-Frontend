import { useLoaderData } from "react-router-dom";
import { ApplicationUserDto } from "../types";
import "../css/course-participants.css";
import { Users } from "lucide-react";

export default function CourseParticipantsPage() {
  const participants = useLoaderData() as ApplicationUserDto[];

  return (
    <section className="crspar-section-container">
      {/* Header */}
      <div className="crspar-header-container">
        <h2 className="crspar-header-title">Kursdeltagare</h2>
      </div>

      {/* Module Container */}
      <div className="crspar-module-container">
        <div className="crspar-module-header">
          <span className="crspar-module-name">
            <Users size={18} className="text-blue-600" />
            Totalt {participants.length} deltagare
          </span>
        </div>

        {/* Participant List */}
        {participants.length === 0 ? (
          <div className="crspar-item-container">
            <p>Inga deltagare hittades.</p>
          </div>
        ) : (
          participants.map((p) => (
            <div key={p.id} className="crspar-item-container">
              <div className="crspar-item-top">
                <span className="crspar-item-title">{p.userName}</span>
              </div>
              <div className="crspar-item-bottom">
                <span className="crspar-subtext">{p.email}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
