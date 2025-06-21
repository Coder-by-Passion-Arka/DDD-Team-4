import React, { useEffect, useState } from 'react';
import { useDrop } from 'react-dnd';
import { DndProvider, useDrag } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

// Props from parent
interface SortingGameProps {
  onBack: () => void;
  onComplete: (won: boolean, score: number) => void;
}

type Category = 'Algorithms' | 'Data Structures' | 'Operating Systems' | 'Networking' | 'Databases';

type ConceptItem = {
  id: number;
  label: string;
  category: Category;
};

const allConcepts: ConceptItem[] = [
  { id: 1, label: 'Merge Sort', category: 'Algorithms' },
  { id: 2, label: 'Binary Tree', category: 'Data Structures' },
  { id: 3, label: 'Round Robin', category: 'Operating Systems' },
  { id: 4, label: 'TCP/IP', category: 'Networking' },
  { id: 5, label: 'Normalization', category: 'Databases' },
  { id: 6, label: 'Dijkstra\'s Algorithm', category: 'Algorithms' },
  { id: 7, label: 'Linked List', category: 'Data Structures' },
  { id: 8, label: 'Deadlock', category: 'Operating Systems' },
  { id: 9, label: 'HTTP Protocol', category: 'Networking' },
  { id: 10, label: 'SQL Joins', category: 'Databases' },
];

const categories: Category[] = ['Algorithms', 'Data Structures', 'Operating Systems', 'Networking', 'Databases'];

const DraggableConcept: React.FC<{ concept: ConceptItem }> = ({ concept }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'concept',
    item: concept,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className="bg-blue-200 text-black rounded px-3 py-2 shadow-md cursor-move my-2"
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      {concept.label}
    </div>
  );
};

const DropZone: React.FC<{
  category: Category;
  onDrop: (item: ConceptItem, zone: Category) => void;
}> = ({ category, onDrop }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'concept',
    drop: (item: ConceptItem) => onDrop(item, category),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop}
      className={`min-h-[100px] p-4 border-2 rounded transition-all ${
        isOver ? 'bg-green-100' : 'bg-white'
      }`}
    >
      <h4 className="font-semibold text-center mb-2">{category}</h4>
    </div>
  );
};

const SortingGame: React.FC<SortingGameProps> = ({ onBack, onComplete }) => {
  const [concepts, setConcepts] = useState<ConceptItem[]>([]);
  const [score, setScore] = useState(0);
  const [results, setResults] = useState<string[]>([]);
  const [gameOver, setGameOver] = useState(false);

  const loadNewConcepts = () => {
    const shuffled = [...allConcepts].sort(() => 0.5 - Math.random()).slice(0, 5);
    setConcepts(shuffled);
    setResults([]);
    setScore(0);
    setGameOver(false);
  };

  useEffect(() => {
    loadNewConcepts();
  }, []);

  const handleDrop = (item: ConceptItem, dropZoneCategory: Category) => {
    setConcepts((prevConcepts) => {
      const updatedConcepts = prevConcepts.filter((c) => c.id !== item.id);
      const isCorrect = item.category === dropZoneCategory;

      if (isCorrect) {
        setScore((s) => s + 1);
        setResults((prev) => [...prev, `✅ ${item.label} was correctly placed.`]);
      } else {
        setResults((prev) => [
          ...prev,
          `❌ ${item.label} was incorrect. Correct category: ${item.category}`,
        ]);
      }

      if (updatedConcepts.length === 0) {
        setGameOver(true);
        onComplete(score + (isCorrect ? 1 : 0) >= 3, score + (isCorrect ? 1 : 0)); // assuming 3+ is win
      }

      return updatedConcepts;
    });
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="p-4 max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">🧠 Sorting Challenge: CS Edition</h2>
          <button
            onClick={onBack}
            className="px-3 py-1 text-sm bg-gray-300 hover:bg-gray-400 rounded"
          >
            ← Back to Menu
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Concepts Panel */}
          <div className="bg-slate-100 p-4 rounded">
            <h3 className="text-lg font-semibold mb-2">Concepts</h3>
            {concepts.length === 0 ? (
              <p className="text-gray-500 italic">No more concepts.</p>
            ) : (
              concepts.map((concept) => (
                <DraggableConcept key={concept.id} concept={concept} />
              ))
            )}
          </div>

          {/* Drop Zones */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {categories.map((cat) => (
              <DropZone key={cat} category={cat} onDrop={handleDrop} />
            ))}
          </div>
        </div>

        {/* Results Feedback */}
        <div className="mt-6 bg-white border rounded p-4">
          <h4 className="text-lg font-semibold mb-2">Result Log</h4>
          {results.length === 0 ? (
            <p className="text-gray-500 italic">No moves yet.</p>
          ) : (
            <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
              {results.map((msg, i) => (
                <li key={i}>{msg}</li>
              ))}
            </ul>
          )}
        </div>

        {/* Score and Restart */}
        <div className="mt-6 flex items-center justify-between">
          <p className="text-xl font-medium">Score: {score}</p>
          {gameOver && (
            <button
              onClick={loadNewConcepts}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              🔁 Restart Game
            </button>
          )}
        </div>
      </div>
    </DndProvider>
  );
};

export default SortingGame;
