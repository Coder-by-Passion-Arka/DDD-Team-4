// StudentsPage.tsx
import React from 'react';
import { User2, ClipboardCheck, CheckCircle2, Clock4 } from 'lucide-react';

const students = [
	{ name: 'Aditi Sharma', email: 'aditi@example.com', completed: 4, total: 6 },
	{ name: 'Ravi Mehta', email: 'ravi@example.com', completed: 3, total: 5 },
	{ name: 'Kiran Patel', email: 'kiran@example.com', completed: 6, total: 6 },
];

const StudentsPage = () => {
	return (
		<div className='p-4 sm:p-6 space-y-4 animate-fadeInUp'>
			<h2 className='text-2xl font-bold text-gray-900 dark:text-white animate-slideInDown'>
				Students
			</h2>

			<div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-4'>
				{students.map((student, idx) => {
					const remaining = student.total - student.completed;
					const completionPercent = Math.round(
						(student.completed / student.total) * 100
					);

					return (
						<div
							key={idx}
							className={`bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover-lift animate-fadeInUp animate-stagger-${idx + 1}`}
						>
							<div className='flex items-center space-x-4 mb-4'>
								<div className='w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center animate-scaleIn'>
									<User2 className='w-6 h-6 text-white' />
								</div>
								<div>
									<h3 className='font-semibold text-gray-900 dark:text-white'>
										{student.name}
									</h3>
									<p className='text-sm text-gray-600 dark:text-gray-400'>
										{student.email}
									</p>
								</div>
							</div>

							<div className='space-y-3'>
								<div className='flex items-center justify-between'>
									<div className='flex items-center space-x-2'>
										<ClipboardCheck className='w-4 h-4 text-green-500' />
										<span className='text-sm text-gray-600 dark:text-gray-400'>
											Completed
										</span>
									</div>
									<span className='font-semibold text-green-600'>
										{student.completed}
									</span>
								</div>

								<div className='flex items-center justify-between'>
									<div className='flex items-center space-x-2'>
										<Clock4 className='w-4 h-4 text-orange-500' />
										<span className='text-sm text-gray-600 dark:text-gray-400'>
											Remaining
										</span>
									</div>
									<span className='font-semibold text-orange-600'>
										{remaining}
									</span>
								</div>

								<div className='mt-4'>
									<div className='flex items-center justify-between mb-2'>
										<span className='text-sm text-gray-600 dark:text-gray-400'>
											Progress
										</span>
										<span className='text-sm font-semibold text-gray-900 dark:text-white'>
											{completionPercent}%
										</span>
									</div>
									<div className='w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden'>
										<div
											className='h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all duration-1000 ease-out'
											style={{ width: `${completionPercent}%` }}
										/>
									</div>
								</div>

								{completionPercent === 100 && (
									<div className='flex items-center space-x-2 mt-3 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg animate-bounce-custom'>
										<CheckCircle2 className='w-4 h-4 text-green-500' />
										<span className='text-sm text-green-700 dark:text-green-300 font-medium'>
											Complete!
										</span>
									</div>
								)}
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default StudentsPage;
