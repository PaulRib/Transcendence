import { Heading } from '../components/ui/heading';
import { useLanguage } from '@/i18n/LanguageContext';
import { useEffect, useState } from 'react';
import { getMatchHistory, type MatchHistoryEntry, } from '@/api/multiplayer.api';
import { useAuth } from '@/auth/AuthContext';

function MatchHistoryPage() {
	const { t, language } = useLanguage();
	const { currentUser } = useAuth();
	const [matches, setMatches] = useState<MatchHistoryEntry[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);


	useEffect(() => {
		async function loadMatchHistory() {
			if (!currentUser) {
				setError(t('matchHistory.loadError'));
				setIsLoading(false);
				return;
			}

			try {
				const history = await getMatchHistory();
				setMatches(history);
				setError(null);
			} catch {
				setError(t('matchHistory.loadError'));
			} finally {
				setIsLoading(false);
			}
		}
		loadMatchHistory();
	}, [t, currentUser]);

	return (
		<div className="mx-auto my-8 w-full max-w-[900px] rounded-xl bg-[#14141e]/85 p-8 text-white">
			<Heading>{t('matchHistory.title')}</Heading>
			{isLoading && <p>{t('matchHistory.loading')}</p>}

			{error && <p className="text-red-400">{error}</p>}

			{!isLoading && !error && matches.length === 0 && (
				<p>{t('matchHistory.empty')}</p>
			)}

			{!isLoading && !error && matches.length > 0 && (
				<div className="mt-6 flex flex-col gap-4">
					{matches.map((entry) => {
						const opponent = entry.match.participants.find(
							(participant) => participant.user.id !== currentUser?.id,
						);

						const resultLabel =
							entry.result === 'win'
								? t('matchHistory.victory')
								: entry.result === 'draw'
									? t('matchHistory.draw')
									: t('matchHistory.defeat');

						const resultClasses =
							entry.result === 'win'
								? 'border-green-500 text-green-400'
								: entry.result === 'draw'
									? 'border-yellow-500 text-yellow-400'
									: 'border-red-500 text-red-400';

						return (
							<div
								key={entry.id}
								className={`flex items-center justify-between gap-4 rounded-xl border-l-4 bg-white/5 p-4 ${resultClasses}`}
							>
								<div className="flex items-center gap-4">
									<div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-white/10">
										{opponent?.user.avatar_url ? (
											<img
												src={opponent.user.avatar_url}
												alt={opponent.user.username}
												className="h-full w-full object-cover"
											/>
										) : (
											opponent?.user.username
												.charAt(0)
												.toUpperCase() ?? '?'
										)}
									</div>

									<div>
										<p className="font-bold">{resultLabel}</p>
										<p className="text-sm text-slate-300">
											{t('matchHistory.versus')}{' '}
											{opponent?.user.username ??
												t('matchHistory.unknownOpponent')}
										</p>
									</div>
								</div>

								<div className="text-right">
									<p className="font-bold">
										{t('matchHistory.points')} : {entry.score}
									</p>
									<p className="text-sm text-slate-400">
										{new Date(entry.match.played_at).toLocaleDateString(
											language,
										)}
									</p>
								</div>
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
}

export default MatchHistoryPage;
