import React, { useEffect, useState } from "react"

import { Link } from "react-router-dom"
import { createQuestion, getSubjects } from "../../../utils/QuizService"

const AddQuestion = () => {
	const [question, setQuestionText] = useState("")
	const [questionType, setQuestionType] = useState("single")
	const [choices, setChoices] = useState([""])
	const [correctAnswers, setCorrectAnswers] = useState([""])
	const [subject, setSubject] = useState("")
	const [newSubject, setNewSubject] = useState("")
	const [subjectOptions, setSubjectOptions] = useState([""])

	useEffect(() => {
		fetchSubjects()
	}, [])

	const fetchSubjects = async () => {
		try {
			const subjectsData = await getSubjects()
			setSubjectOptions(subjectsData)
		} catch (error) {
			console.error(error)
		}
	}

	const handleAddChoice = () => {
		const lastChoice = choices[choices.length - 1]
		const lastChoiceLetter = lastChoice ? lastChoice.charAt(0) : "A"
		const newChoiceLetter = String.fromCharCode(lastChoiceLetter.charCodeAt(0) + 1)
		const newChoice = `${newChoiceLetter}.`
		setChoices([...choices, newChoice])
	}

	const handleRemoveChoice = (index) => {
		setChoices(choices.filter((choice, i) => i !== index))
	}

	const handleChoiceChange = (index, value) => {
		setChoices(choices.map((choice, i) => (i === index ? value : choice)))
	}

	const handleCorrectAnswerChange = (index, value) => {
		setCorrectAnswers(correctAnswers.map((answer, i) => (i === index ? value : answer)))
	}

	const handleAddCorrectAnswer = () => {
		setCorrectAnswers([...correctAnswers, ""])
	}

	const handleRemoveCorrectAnswer = (index) => {
		setCorrectAnswers(correctAnswers.filter((answer, i) => i !== index))
	}

	const handleSubmit = async (e) => {
		e.preventDefault()
		try {
			const result = {
				question,
				questionType,
				choices,
				correctAnswers: correctAnswers.map((answer) => {
					const choiceLetter = answer.charAt(0).toUpperCase()
					const choiceIndex = choiceLetter.charCodeAt(0) - 65
					return choiceIndex >= 0 && choiceIndex < choices.length ? choiceLetter : null
				}),

				subject
			}

			await createQuestion(result)

			setQuestionText("")
			setQuestionType("single")
			setChoices([""])
			setCorrectAnswers([""])
			setSubject("")
		} catch (error) {
			console.error(error)
		}
	}

	const handleAddSubject = () => {
		if (newSubject.trim() !== "") {
			setSubject(newSubject.trim())
			setSubjectOptions([...subjectOptions, newSubject.trim()])
			setNewSubject("")
		}
	}

	return (
		<div className="container">
			<div className="row justify-content-center">
				<div className="col-md-6  mt-5">
					<div className="card">
						<div className="card-header">
							<h5 className="card-title">Adicionar novas perguntas</h5>
						</div>
						<div className="card-body">
							<form onSubmit={handleSubmit} className="p-2">
								<div className="mb-3">
									<label htmlFor="subject" className="form-label text-info">
									Escolha um assunto
									</label>
									<select
										id="subject"
										value={subject}
										onChange={(e) => setSubject(e.target.value)}
										className="form-control">
										<option value="">Selecione o assunto</option>
										<option value={"New"}>Adicionar novo</option>
										{subjectOptions.map((option) => (
											<option key={option} value={option}>
												{option}
											</option>
										))}
									</select>
								</div>

								{subject === "New" && (
									<div className="mb-3">
										<label htmlFor="new-subject" className="form-label text-info">
										Adicionar novo assunto
										</label>
										<input
											type="text"
											id="new-subject"
											value={newSubject}
											onChange={(event) => setNewSubject(event.target.value)}
											className="form-control"
										/>
										<button
											type="button"
											onClick={handleAddSubject}
											className="btn btn-outline-primary mt-2">
											Adicionar assunto
										</button>
									</div>
								)}
								<div className="mb-3">
									<label htmlFor="question-text" className="form-label text-info">
									Pergunta
									</label>
									<textarea
										className="form-control"
										rows={4}
										value={question}
										onChange={(e) => setQuestionText(e.target.value)}></textarea>
								</div>
								<div className="mb-3">
									<label htmlFor="question-type" className="form-label text-info">
									Tipo de pergunta
									</label>
									<select
										id="question-type"
										value={questionType}
										onChange={(event) => setQuestionType(event.target.value)}
										className="form-control">
										<option value="single">Resposta única</option>
										<option value="multiple">Resposta múltipla</option>
									</select>
								</div>
								<div className="mb-3">
									<label htmlFor="choices" className="form-label text-primary">
									Alternativa
									</label>
									{choices.map((choice, index) => (
										<div key={index} className="input-group mb-3">
											<input
												type="text"
												value={choice}
												onChange={(e) => handleChoiceChange(index, e.target.value)}
												className="form-control"
											/>
											<button
												type="button"
												onClick={() => handleRemoveChoice(index)}
												className="btn btn-outline-danger">
												Remover
											</button>
										</div>
									))}
									<button
										type="button"
										onClick={handleAddChoice}
										className="btn btn-outline-primary">
										Adicionar alternativa
									</button>
								</div>
								{questionType === "single" && (
									<div className="mb-3">
										<label htmlFor="answer" className="form-label text-success">
											Resposta correta
										</label>
										<input
											type="text"
											className="form-control"
											id="answer"
											value={correctAnswers[0]}
											onChange={(e) => handleCorrectAnswerChange(0, e.target.value)}
										/>
									</div>
								)}
								{questionType === "multiple" && (
									<div className="mb-3">
										<label htmlFor="answer" className="form-label text-success">
											Respostas corretas
										</label>
										{correctAnswers.map((answer, index) => (
											<div key={index} className="d-flex mb-2">
												<input
													type="text"
													className="form-control me-2"
													value={answer}
													onChange={(e) => handleCorrectAnswerChange(index, e.target.value)}
												/>
												{index > 0 && (
													<button
														type="button"
														className="btn btn-danger"
														onClick={() => handleRemoveCorrectAnswer(index)}>
														Remover
													</button>
												)}
											</div>
										))}
										<button
											type="button"
											className="btn btn-outline-info"
											onClick={handleAddCorrectAnswer}>
											Adicionar resposta correta
										</button>
									</div>
								)}

								{!correctAnswers.length && <p>Por favor insira pelo menos uma resposta correta.</p>}

								<div className="btn-group">
									<button type="submit" className="btn btn-outline-success mr-2">
										Salvar questão
									</button>
									<Link to={"/all-quizzes"} className="btn btn-outline-primary ml-2">
									Voltar às perguntas existentes
									</Link>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default AddQuestion