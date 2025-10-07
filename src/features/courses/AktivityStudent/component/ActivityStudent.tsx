import { ReactElement } from "react";
import { useEffect, useState } from "react";
import "../css/style.css";
import { fetchWithToken } from "../../../shared/utilities";

interface Activity{
    id: string;
    name: string;
    description: string;
    startTime: string;
    endTime: string;
    type: string;
}
interface ActivityProps{
    moduleId: string;
}

export default function ActivityStudent({moduleId}:ActivityProps):ReactElement {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivities = async () => {
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
    };
    fetchActivities();
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

  if (loading) return <p className="loading">Laddar...</p>;
  if (error) return <p className="error">{error}</p>;
  if (activities.length === 0) return <p className="no-activities">Inga aktiviteter för denna modul.</p>;

      return (
       <div className="activity-list-container">
        <h3 className="section-title">Aktiviteter</h3>
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
       </div>
      )
};