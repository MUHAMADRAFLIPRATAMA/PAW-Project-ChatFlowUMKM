const { formatCurrency } = require('../../../utils/format');

describe('formatCurrency', () => {
  afterEach(() => vi.restoreAllMocks());

  it('memformat angka sebagai Rupiah dengan locale Indonesia', () => {
    expect(formatCurrency(18000)).toBe('Rp 18.000');
  });

  it('melempar error untuk nilai yang tidak memiliki format angka', () => {
    expect(() => formatCurrency(undefined)).toThrow(TypeError);
  });
});
