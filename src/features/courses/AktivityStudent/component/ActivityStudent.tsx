import { ReactElement, useCallback } from "react";
import { useEffect, useState } from "react";
import "../css/style.css";
import { fetchWithToken } from "../../../shared/utilities";
import CreateActivityModal from "../../ActivityModals/CreateActivityModal";
import { FilePlus2 } from "lucide-react";

interface Activity{
    id: string;
    name: string;
    description: string;
    startTime: string;
    endTime: string;
    type: string;
}
interface ActivityStudentProps{
    moduleId: string;
}

export default function ActivityStudent({moduleId}:ActivityStudentProps):ReactElement {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const userRole = "Teacher"; // WIP


    const fetchActivities = useCallback(async () => {
          setLoading(true);

      try {
        const data= await fetchWithToken<any>(
          `https://localhost:7213/api/activity/${moduleId}/activities`
        );
          setActivities(data);
        } catch {
        setError("Inga aktiviteter för denna modul.");
      } finally {
        setLoading(false); 
      }
  }, [moduleId]);

    useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

const formatDateTime = (dateString: string) =>
  new Date(dateString).toLocaleString("sv-SE", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  }).replace(',', '');

  const renderActivities = () => {
    return (
              <ul className="activity-list">
          {activities.map((activity)=>(
            <li key={activity.id} className="activity-item">
              <h4 className="activity-name"><span className="activity-type">{activity.type}</span>{activity.name}</h4>
              {/*<p className="activity-description">{activity.description}</p>*/}
              <p className="activity-dates">
               {formatDateTime(activity.startTime)} – {formatDateTime(activity.endTime)}
              </p>
              
            </li>
          ))}

        </ul>
    )
  }

    const renderNoActivities = () => {
    return <p className="no-activities">Inga aktiviteter för denna modul.</p>
  }

  if (loading) return <p className="loading">Laddar...</p>;
  if (error) return <p className="error">{error}</p>;

      return (
        <section>
       <div className="activity-list-container">
        <h3>Aktiviteter</h3>      
        <ul className="activity-list">
          {activities.length === 0 ?
            renderNoActivities() : renderActivities()}
        </ul>
        {userRole === "Teacher" ? (
          <div>
            <button
              className="create-activity-btn"
             onClick={() => setModalOpen(true)}
            >
              <FilePlus2 size={16}/> Lägg till aktivitet
            </button>
            <CreateActivityModal
              moduleId={moduleId}
              existingActivities={activities}
              open={modalOpen}
              onClose={() => setModalOpen(false)}
              onActivityCreated={() => {
                fetchActivities(); 
              }}
              userRole={userRole}
            />
        </div>
      ) : null}
       </div>

       </section>
      )
};