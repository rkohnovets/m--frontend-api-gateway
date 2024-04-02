import { useState, useEffect } from "react"
import { backend_api_https } from "../../config";

const HomePage = () => {
    const [ test, setTest ] = useState<string>("loading...");

    const getTestString = async () => {
        let response = await fetch(
            backend_api_https + '/test', 
            {
                method: 'GET',
                mode: 'cors'
            }
        )

        if(response.ok) {
            const str : string = await response.json()
            setTest(str)
        } else {
            let text = await response.text()
            alert("Code " + response.status + ", message: " + text)
            setTest("request failed")
        }
    }

    useEffect(() => {
        getTestString()
            // make sure to catch any error
            .catch(console.error)
    }, [])

    return (
        <div className="max-w-3xl mx-auto">
            Home Page, {test}
        </div>
    );
}

export default HomePage;