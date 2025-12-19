import { Button } from './Button';

export function PrivacyScreen({ playerName, onContinue }) {
  return (
    <div className="fixed inset-0 bg-red-900 flex flex-col items-center justify-center p-8 z-50">
      <div className="text-center">
        <div className="text-6xl mb-8">🛑</div>
        <h1 className="text-4xl font-bold text-white mb-4">STOP!</h1>
        <p className="text-2xl text-white mb-8">
          Pass device to:<br />
          <span className="font-bold text-3xl mt-2 block">{playerName}</span>
        </p>
        <Button onClick={onContinue} variant="danger">
          I am {playerName} - Continue
        </Button>
      </div>
    </div>
  );
}
