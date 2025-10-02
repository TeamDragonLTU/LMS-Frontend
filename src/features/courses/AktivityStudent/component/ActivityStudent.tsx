import { ReactElement } from "react";
import "../css/style.css";
import { fetchWithToken } from "../../../shared/utilities";

interface Activity{
    id: string;
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    type: string;
}
interface ActivityProps{
    moduleId: string;
}

export default function ActivityStudent({moduleId}:A):ReactElement {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const data= await fetchWithToken<any>(
          `https://localhost:7213/api/activity/module/${moduleId}/activities `
        );
          setActivities(data);
        } catch {
        setError("Cannot find activities.");
      } finally {
        setLoading(false); 
      }
    };
    fetchActivities();
  }, [moduleId]);

  if (loading) return <p className="loading">Laddar...</p>;
  if (error) return <p className="error">{error}</p>;
  if (activities.length === 0) return <p className="no-activities">Inga aktiviteter för denna modul.</p>;

      return (
       <div className="activity-list-container">
        <h3 className="section-title">Aktiviteter</h3>
        <ul className="activity-list">
          {activities.map((activity)=>(
            <li key={acitivity.id} className="activity-item">
              <h4 className="activity-name">{activity.name}</h4>
              <p className="activity-description">{activity.description}</p>
              <p className="activity-dates">
                {new Date(activity.startDate).toLocaleDateString("sv-SE", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}{" "}–{" "}
                {new Date(activity.endDate).toLocaleDateString("sv-SE", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
              <p className="activity-type">{activity.type}</p>
            </li>
          ))}
        </ul>
       </div>
      )
};