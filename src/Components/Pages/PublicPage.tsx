import { useEffect, useState } from "react";
import { api_https } from "../../config.ts";

const PublicPage = () => {

    /*
    interface WeatherData {
        date: string,
        temperatureC: number
    }

    const [ weather, setWeather ] = useState(new Array<WeatherData>());

    useEffect(() => {
        // declare the async data fetching function
        const fetchData = async () => {
            let response = await fetch(api_https + '/WeatherForecast', {
                method: 'GET',
                credentials: 'include',
                mode: 'cors'
            });

            if(response.ok) {
                setWeather( await response.json());
            } else {
                let text = await response.text();
                alert("Code " + response.status + ", message: " + text);
            }
        }

        // call the function
        fetchData()
            // make sure to catch any error
            .catch(console.error);
    }, [])
    */

    return (
        <div>
            <p>Public page</p>
        </div>
    );
}

export default PublicPage;