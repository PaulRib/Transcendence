import { useEffect, useState } from "react";
import { PageContainer } from "../../components/ui/page-content";
import { Heading } from "../../components/ui/heading";
import { useLanguage } from "../../i18n/LanguageContext";
import { getCountryNames } from "../../api/countrydle/countries.api";
import { sendCountryGuess } from "../../api/countrydle/dailycountrygame.api";
import type { CountryGuessResponse, CountryName } from "../../api/type.api";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";

function CountrydlePage() {
	const { t } = useLanguage();
	const [inputValue, setInputValue] = useState('');
	const [countryNames, setCountryNames] = useState<CountryName[]>([]);
	const [guesses, setGuesses] = useState<CountryGuessResponse[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		async function loadCountries() {
			try {
				setIsLoading(true);
				const names = await getCountryNames();
				setCountryNames(names);
				setError(null);
			} catch {
				setError(t("countrydle.loadError"));
			} finally {
				setIsLoading(false);
			}
		}

		loadCountries();
	}, [t]);

	const formatStatus = (status: string) => {
		if (status === 'correct') {
			return t("countrydle.correct");
		}

		return t("countrydle.incorrect");
	};

	const getStatusClassName = (status: string) => {
		if (status === 'correct') {
			return "bg-green-500/20 border-green-500/50 text-green-100";
		}

		return "bg-red-500/20 border-red-500/50 text-red-100";
	};

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();

		const validCountry = countryNames.find(
			(country) => country.name.toLowerCase() === inputValue.trim().toLowerCase()
		);

		if (!validCountry) {
			alert(t("countrydle.invalidCountry"));
			return;
		}

		if (guesses.some((guess) => guess.name.toLowerCase() === validCountry.name.toLowerCase())) {
			return;
		}

		try {
			const result = await sendCountryGuess(validCountry.name);
			setGuesses([result, ...guesses]);
			setInputValue('');
		} catch {
			alert(t("countrydle.tryError"));
		}
	};

	if (isLoading) {
		return <div style={{ textAlign: 'center', padding: '50px' }}>{t("countrydle.loading")}</div>;
	}

	return (
		<PageContainer>
			<Heading>{t("countrydle.title")}</Heading>
			<p>{t("countrydle.subtitle")}</p>

			{error && <div className="error-alert">{error}</div>}

			<form onSubmit={handleSubmit} className="flex w-full max-w-md items-center gap-2">
				<Input
					type="text"
					placeholder={t("countrydle.placeholder")}
					value={inputValue}
					onChange={(event) => setInputValue(event.target.value)}
				/>
				<Button type="submit">
					{t("countrydle.submit")}
				</Button>
			</form>

			<div className="mt-8 flex flex-col gap-3 w-full max-w-md">
				{guesses.map((guess, index) => (
					<div key={`${guess.name}-${index}`} className="bg-white/5 border border-white/10 rounded-lg p-4">
						<div className="flex items-center gap-3 mb-3">
							<img src={guess.flagUrl} alt={guess.name} className="w-10 h-7 object-cover" />
							<strong>{guess.name}</strong>
						</div>

						<div className="grid gap-2">
							<div className={`rounded-md border px-3 py-2 ${getStatusClassName(guess.continent.status)}`}>
								<strong>{t("countrydle.continent")}</strong>: {guess.continent.value} ({formatStatus(guess.continent.status)})
							</div>

							<div className={`rounded-md border px-3 py-2 ${getStatusClassName(guess.region.status)}`}>
								<strong>{t("countrydle.region")}</strong>: {guess.region.value} ({formatStatus(guess.region.status)})
							</div>

							<div className={`rounded-md border px-3 py-2 ${getStatusClassName(guess.language.status)}`}>
								<strong>{t("countrydle.language")}</strong>: {guess.language.value} ({formatStatus(guess.language.status)})
							</div>
						</div>
					</div>
				))}
			</div>
		</PageContainer>
	);
}

export default CountrydlePage;