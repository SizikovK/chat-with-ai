import { Link } from "react-router-dom";

function Home() {
    return (
        <section className="home-page">
            <div className="home-hero">
                <h1>Neuro Chat</h1>
                <p>
                    Легкий чат с ИИ: создавай диалоги, сохраняй историю и
                    продолжай в любой момент.
                </p>
                <div className="home-actions">
                    <Link to="/chats" className="home-btn">
                        Открыть чаты
                    </Link>
                </div>
            </div>
        </section>
    )
}


export default Home