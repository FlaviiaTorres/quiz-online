import React from "react"
import { useLocation} from "react-router-dom"

 const QuizResult = () => {
		const location = useLocation()
		const { quizQuestions, totalScores } = location.state
		const numQuestions = quizQuestions.length
		const percentage = Math.round((totalScores / numQuestions) * 100)

		const handleRetakeQuiz = () => {
			alert("Oops! this functionality was not implemented!!!")
		}

		return (
			<section className="container mt-5">
				<h3>Resumo do resultado do seu quiz!</h3>
				<hr />
				<h5 className="text-info">
					Você respondeu {totalScores} de {numQuestions} perguntas corretas.
				</h5>
				<p>Sua pontuação total é {percentage}%.</p>

				<button className="btn btn-primary btn-sm" onClick={handleRetakeQuiz}>
					Refazer este teste
				</button>
			</section>
		)
 }

 export default QuizResult