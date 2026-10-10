import Card from "@/components/common/Card"
import ModelState from "./ModelState"
import { loss } from "./modelTheme"

export default function ModelInfoCard() {
  return (
    <Card title="모델 정보">
      <ModelState>
        {({ experiment_id, learning_curve: lc, classification_metrics: c }) => {
          const rows: [string, string | undefined][] = [
            ["학습 기간", lc.train_period],
            ["검증 기간", lc.val_period],
            ["테스트 기간", c.test_period],
            ["에폭 · 배치", lc.epochs != null ? `${lc.epochs} · ${lc.batch_size ?? "–"}` : undefined],
            ["학습률", lc.learning_rate?.toString()],
            ["손실 함수", lc.loss],
            ["최적 시점", lc.best ? `${lc.best.epoch}에폭 (val ${loss(lc.best.val_loss)})` : undefined],
          ]
          return (
            <>
              <dl className="divide-y divide-line text-[11px]">
                {rows
                  .filter(([, v]) => v)
                  .map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-3 py-1.5">
                      <dt className="shrink-0 text-slate-500">{k}</dt>
                      <dd className="min-w-0 truncate text-right font-semibold text-navy-900" title={v}>
                        {v}
                      </dd>
                    </div>
                  ))}
              </dl>
              <p className="mt-2 truncate rounded-lg bg-slate-50 px-3 py-2 font-mono text-[10px] text-slate-500" title={experiment_id}>
                {experiment_id}
              </p>
            </>
          )
        }}
      </ModelState>
    </Card>
  )
}
